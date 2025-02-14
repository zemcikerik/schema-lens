import { ComponentRef, NgZone, Type, ViewContainerRef } from '@angular/core';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { create as svgCreate, append as svgAppend } from 'tiny-svg';
import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type { ModuleDeclaration } from 'didi';
import AngularElementTrackerModule, { AngularElementTracker } from './angular-element-tracker.module';

export type AngularComponentMap = Partial<Record<string, Type<unknown>>>;

export abstract class AngularComponentShapeRenderer extends BaseRenderer {

  static readonly $inject = [
    'eventBus', 'elementRegistry', 'viewContainerRef', 'ngZone', 'angularElementTracker'
  ];

  constructor(
    private readonly eventBus: EventBus,
    private readonly elementRegistry: ElementRegistry,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly ngZone: NgZone,
    private readonly angularElementTracker: AngularElementTracker,
  ) {
    super(eventBus, 1500);
    this.listenForShapeRemoval();
    this.listenForDiagramShutdown();
  }

  protected abstract getComponents(): AngularComponentMap;

  protected getComponent(shapeId: string): Type<unknown> | null {
    const [identifier] = shapeId.split('_');
    return this.getComponents()[identifier] ?? null;
  }

  override canRender(element: SVGElement): boolean {
    return this.getComponent(element.id) !== null;
  }

  override drawShape(visuals: SVGElement, shape: Shape): SVGElement {
    const component = this.getComponent(shape.id);

    if (!component) {
      return super.drawShape(visuals, shape);
    }

    this.angularElementTracker.getComponentWrapper(shape)?.remove();

    const wrapper = svgCreate('foreignObject');
    wrapper.setAttribute('width', String(shape.width));
    wrapper.setAttribute('height', String(shape.height));
    svgAppend(visuals, wrapper);

    const componentRef: ComponentRef<unknown> = this.angularElementTracker.getComponentRef(shape)
      ?? this.ngZone.run(() => this.viewContainerRef.createComponent(component));

    wrapper.appendChild(componentRef.location.nativeElement);

    this.angularElementTracker.attachComponentWrapper(shape, wrapper);
    this.angularElementTracker.attachComponentRef(shape, componentRef);
    return visuals;
  }

  setShapeInput(shape: Shape, name: string, value: unknown): boolean {
    const componentRef = this.angularElementTracker.getComponentRef(shape);

    if (componentRef === null) {
      return false;
    }

    this.ngZone.run(() => componentRef.setInput(name, value));
    return true;
  }

  private listenForShapeRemoval(): void {
    this.eventBus.on('shape.remove', 3000, (event: { element: Shape }) => {
      this.tryDestroyBackingAngularComponent(event.element);
    });
  }

  private listenForDiagramShutdown(): void {
    this.eventBus.on(['diagram.destroy', 'diagram.clear'], 3000, () => {
      this.elementRegistry.forEach(element => {
        this.tryDestroyBackingAngularComponent(element);
      });
    });
  }

  private tryDestroyBackingAngularComponent(element: ElementLike): void {
    const componentRef = this.angularElementTracker.getComponentRef(element);

    if (componentRef === null) {
      return;
    }

    this.ngZone.run(() => componentRef.destroy());
    this.angularElementTracker.detachComponentRef(element);
  }

}

export default class AngularComponentShapeRendererFactory {

  static create(components: AngularComponentMap): ModuleDeclaration {
    return {
      __depends__: [AngularElementTrackerModule],
      __init__: ['angularComponentShapeRenderer'],
      angularComponentShapeRenderer: ['type', class extends AngularComponentShapeRenderer {
        override getComponents = () => components;
      }],
    };
  }

}
