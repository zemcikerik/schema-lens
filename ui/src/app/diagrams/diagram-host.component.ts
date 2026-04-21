/* eslint-disable @typescript-eslint/no-non-null-assertion */
// diagram components initialized after view init

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import Diagram from 'diagram-js';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ResizeModule from 'diagram-js/lib/features/resize';
import RuleModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import type { ModuleDeclaration } from 'didi';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Canvas from 'diagram-js/lib/core/Canvas';
import type { Connection, ElementLike, Parent, Root, Shape } from 'diagram-js/lib/model/Types';
import { AngularHostContextModuleFactory } from './angular/angular-host-context.module';
import { GridBackground, GridBackgroundModule } from './util/grid-background.module';
import EventBus from 'diagram-js/lib/core/EventBus';
import { CroppingConnectionDockingModule } from './util/cropping-connection-docking.module';
import type { Point } from 'diagram-js/lib/util/Types';
import Selection from 'diagram-js/lib/features/selection/Selection';
import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';
import ConnectionDocking from 'diagram-js/lib/layout/ConnectionDocking';

@Component({
  selector: 'app-diagram-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramHostComponent implements AfterViewInit, OnDestroy {
  modules = input<ModuleDeclaration[]>([]);
  elementsChanged = output<ElementLike[]>();

  private _gridVisible = signal<boolean>(false);
  readonly gridVisible = this._gridVisible.asReadonly();

  private diagram: Diagram = null!;
  private canvas: Canvas = null!;
  private elementFactory: ElementFactory = null!;
  private eventBus: EventBus = null!;
  private gridBackground: GridBackground = null!;
  private selection: Selection = null!;
  private layouter: BaseLayouter = null!;
  private connectionDocking: ConnectionDocking = null!;

  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    const modules = this.modules();

    this.ngZone.runOutsideAngular(() => {
      this.diagram = new Diagram({
        canvas: {
          container: this.elementRef.nativeElement,
          deferUpdate: true,
        },
        modules: [
          BendpointsModule,
          ConnectionPreviewModule,
          GridBackgroundModule,
          ModelingModule,
          MoveModule,
          MoveCanvasModule,
          ResizeModule,
          RuleModule,
          SelectionModule,
          ZoomScrollModule,
          CroppingConnectionDockingModule,
          AngularHostContextModuleFactory.create({
            ngZone: this.ngZone,
            viewContainerRef: this.viewContainerRef,
          }),
          ...modules,
        ],
      });

      this.canvas = this.diagram.get<Canvas>('canvas');
      this.elementFactory = this.diagram.get<ElementFactory>('elementFactory');
      this.eventBus = this.diagram.get<EventBus>('eventBus');
      this.gridBackground = this.diagram.get<GridBackground>('gridBackground');
      this.selection = this.diagram.get<Selection>('selection');
      this.layouter = this.diagram.get<BaseLayouter>('layouter');
      this.connectionDocking = this.diagram.get<ConnectionDocking>('connectionDocking');

      this.eventBus.on('elements.changed', 100, (_event, { elements }: { elements: ElementLike[] }) => {
        this.ngZone.run(() => this.elementsChanged.emit(elements));
      });
    });

    this._gridVisible.set(this.runInDiagramContext(() => this.gridBackground.isBackgroundShown()));
  }

  isInitialized(): boolean {
    return this.diagram !== null;
  }

  createRoot(id: string): Root {
    return this.runInDiagramContext(() => {
      const root = this.elementFactory.createRoot({ id, isImplicit: false });
      this.canvas.addRootElement(root);
      this.canvas.showLayer(root['layer']);
      return root;
    });
  }

  addShape(shape: Partial<Shape>, parent?: Parent): Shape {
    return this.runInDiagramContext(() => {
      const { x, y } = this.getNewShapePosition(shape);

      const createdShape = this.elementFactory.createShape({ ...shape, x, y });
      this.canvas.addShape(createdShape, parent);
      return createdShape;
    });
  }

  private getNewShapePosition(shape: Partial<Shape>): Point {
    if (shape.x !== undefined && shape.y !== undefined) {
      return { x: shape.x, y: shape.y };
    }
    if (shape.width === undefined || shape.height === undefined) {
      throw new Error(`Cannot place shape of unknown dimensions`);
    }

    const { x, y, width, height } = this.canvas.viewbox();

    return {
      x: x + width / 2 - shape.width / 2,
      y: y + height / 2 - shape.height / 2,
    };
  }

  addConnection(from: Shape, to: Shape, connection: Partial<Connection>, parent?: Parent): Connection {
    return this.runInDiagramContext(() => {
      const target = parent ?? from.parent ?? to.parent;

      if (!target) {
        throw new Error('Connection parent is undefined');
      }

      const template = { ...connection, source: from, target: to, parent };
      template.waypoints ??= this.layouter.layoutConnection(template as Connection);
      template.waypoints = this.connectionDocking.getCroppedWaypoints(template as Connection);
      template.waypoints.forEach(point => delete (point as Point & { original?: Point }).original);

      const createdConnection = this.elementFactory.createConnection(template);
      this.canvas.addConnection(createdConnection);
      return createdConnection;
    });
  }

  updateAll(elements: ElementLike[], updatesById: Record<string, Partial<ElementLike>>): void {
    this.runInDiagramContext(() => {
      elements.forEach(element => {
        Object.entries(updatesById[element.id]).forEach(([key, value]) => (element[key] = value));
      });
      this.eventBus.fire('elements.changed', { elements: [...elements] });
    });
  }

  removeShape(shape: Shape): void {
    this.runInDiagramContext(() => this.canvas.removeShape(shape));
  }

  removeConnection(connection: Connection): void {
    this.runInDiagramContext(() => this.canvas.removeConnection(connection));
  }

  getDiagramRoot(): HTMLElement {
    return this.runInDiagramContext(() => this.canvas.getContainer());
  }

  getZoomLevel(): number {
    return this.runInDiagramContext(() => this.canvas.zoom());
  }

  setZoomLevel(zoomLevel: number): void {
    this.runInDiagramContext(() => this.canvas.zoom(zoomLevel));
  }

  setGridVisibility(visible: boolean): void {
    this.runInDiagramContext(() => {
      if (visible) {
        this.gridBackground.showBackground();
      } else {
        this.gridBackground.hideBackground();
      }
    });

    this._gridVisible.set(visible);
  }

  unselectAll(): void {
    this.runInDiagramContext(() => this.selection.select([]));
  }

  runInDiagramContext<T = void>(runner: (diagram: Diagram) => T): T {
    return this.ngZone.runOutsideAngular(() => runner(this.diagram));
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.diagram.destroy());
  }
}
