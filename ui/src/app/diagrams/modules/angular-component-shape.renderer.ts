import { ComponentRef, NgZone, Type, ViewContainerRef } from '@angular/core';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type { ModuleDeclaration } from 'didi';
import { create as svgCreate, append as svgAppend } from 'tiny-svg';

const COMPONENT_REF_KEY = 'ng_componentRef';
const COMPONENT_WRAPPER_KEY = 'ng_componentWrapper';

export type AngularComponentMap = Partial<Record<string, Type<unknown>>>;

export abstract class AngularComponentShapeRenderer extends BaseRenderer {

  static readonly $inject = ['eventBus', 'elementRegistry', 'viewContainerRef', 'ngZone'];

  constructor(
    private readonly eventBus: EventBus,
    private readonly elementRegistry: ElementRegistry,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly ngZone: NgZone,
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
      return visuals;
    }

    if (shape[COMPONENT_WRAPPER_KEY]) {
      const oldForeignObject: SVGForeignObjectElement = shape[COMPONENT_WRAPPER_KEY];
      oldForeignObject.remove();
    }

    const foreignObject = svgCreate('foreignObject');
    foreignObject.setAttribute('width', String(shape.width));
    foreignObject.setAttribute('height', String(shape.height));
    svgAppend(visuals, foreignObject);

    const componentRef: ComponentRef<unknown> = shape[COMPONENT_REF_KEY]
      ?? this.ngZone.run(() => this.viewContainerRef.createComponent(component));

    foreignObject.appendChild(componentRef.location.nativeElement);

    shape[COMPONENT_WRAPPER_KEY] = foreignObject;
    shape[COMPONENT_REF_KEY] = componentRef;
    return visuals;
  }

  getBackingComponent<T extends Type<unknown>>(shape: Shape): T | null {
    const componentRef: ComponentRef<unknown> | undefined = shape[COMPONENT_REF_KEY];
    return (componentRef?.instance as T | undefined) ?? null;
  }

  setShapeInput(shape: Shape, name: string, value: unknown): boolean {
    if (!shape[COMPONENT_REF_KEY]) {
      return false;
    }

    const componentRef: ComponentRef<unknown> = shape[COMPONENT_REF_KEY];
    this.ngZone.run(() => componentRef.setInput(name, value));
    return true;
  }

  private listenForShapeRemoval(): void {
    this.eventBus.on('shape.remove', 3000, event => {
      const shape = (event as Record<string, unknown>)['element'] as Shape | undefined;
      this.tryDestroyBackingAngularComponent(shape);
    });
  }

  private listenForDiagramShutdown(): void {
    this.eventBus.on(['diagram.destroy', 'diagram.clear'], 3000, () => {
      this.elementRegistry.forEach(element => {
        this.tryDestroyBackingAngularComponent(element);
      });
    });
  }

  private tryDestroyBackingAngularComponent(element?: ElementLike | null): void {
    if (!element || !element[COMPONENT_REF_KEY]) {
      return;
    }

    const componentRef: ComponentRef<unknown> = element[COMPONENT_REF_KEY];
    this.ngZone.run(() => componentRef.destroy());
    delete element[COMPONENT_REF_KEY];
  }

}

export default class AngularComponentShapeRendererFactory {

  static create(components: AngularComponentMap): ModuleDeclaration {
    return {
      __init__: ['angularComponentShapeRenderer'],
      angularComponentShapeRenderer: ['type', class extends AngularComponentShapeRenderer {
        override getComponents = () => components;
      }],
    };
  }

}
