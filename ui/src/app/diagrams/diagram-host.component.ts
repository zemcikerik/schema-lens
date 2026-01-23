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
  ViewContainerRef,
} from '@angular/core';
import Diagram from 'diagram-js';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
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
import type { Connection, ElementLike, Shape } from 'diagram-js/lib/model/Types';
import { AngularHostContextModuleFactory } from './angular/angular-host-context.module';
import { UnfocusModule } from './util/unfocus.module';
import { GridBackground, GridBackgroundModule } from './util/grid-background.module';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import EventBus from 'diagram-js/lib/core/EventBus';
import { CroppingConnectionDockingModule } from './util/cropping-connection-docking.module';

@Component({
  selector: 'app-diagram-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramHostComponent implements AfterViewInit, OnDestroy {
  modules = input<ModuleDeclaration[]>([]);
  elementsChanged = output<ElementLike[]>();

  // initialized after view init
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private diagram: Diagram = null!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private canvas: Canvas = null!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private elementFactory: ElementFactory = null!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private eventBus: EventBus = null!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private modeling: Modeling = null!;

  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    const modules = this.modules();

    const { diagram, canvas, elementFactory, eventBus, modeling } = this.ngZone.runOutsideAngular(() => {
      const diagram = new Diagram({
        canvas: {
          container: this.elementRef.nativeElement,
          deferUpdate: true,
        },
        modules: [
          BendpointsModule,
          GridBackgroundModule,
          ModelingModule,
          MoveModule,
          MoveCanvasModule,
          ResizeModule,
          RuleModule,
          SelectionModule,
          UnfocusModule,
          ZoomScrollModule,
          CroppingConnectionDockingModule,
          AngularHostContextModuleFactory.create({
            ngZone: this.ngZone,
            viewContainerRef: this.viewContainerRef,
          }),
          ...modules,
        ],
      });
      const canvas = diagram.get<Canvas>('canvas');
      const elementFactory = diagram.get<ElementFactory>('elementFactory');
      const eventBus = diagram.get<EventBus>('eventBus');
      const modeling = diagram.get<Modeling>('modeling');

      eventBus.on('elements.changed', 100, (_event, { elements }: { elements: ElementLike[] }) => {
        this.ngZone.run(() => this.elementsChanged.emit(elements));
      });

      return { diagram, canvas, elementFactory, eventBus, modeling };
    });

    this.diagram = diagram;
    this.canvas = canvas;
    this.elementFactory = elementFactory;
    this.eventBus = eventBus;
    this.modeling = modeling;
  }

  addShape(shape: Partial<Shape>): Shape {
    return this.runInDiagramContext(() => {
      const createdShape = this.elementFactory.createShape(shape);
      this.canvas.addShape(createdShape);
      return createdShape;
    });
  }

  connect(from: Shape, to: Shape, connection: Partial<Connection>): Connection {
    return this.runInDiagramContext(() => this.modeling.connect(from, to, connection));
  }

  addConnection(connection: Partial<Connection>): Connection {
    return this.runInDiagramContext(() => {
      const createdConnection = this.elementFactory.createConnection(connection);
      this.canvas.addConnection(createdConnection);
      return createdConnection;
    });
  }

  updateAll(elements: ElementLike[], updatesById: Record<string, Partial<ElementLike>>): void {
    this.runInDiagramContext(() => {
      elements.forEach(element => {
        Object.entries(updatesById[element.id]).forEach(([key, value]) => element[key] = value);
      });
      this.eventBus.fire('elements.changed', { elements: [...elements] });
    });
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

  isGridVisible(): boolean {
    return this.runInDiagramContext(diagram => diagram.get<GridBackground>('gridBackground').isBackgroundShown());
  }

  setGridVisibility(visible: boolean): void {
    this.runInDiagramContext(diagram =>{
      const grid = diagram.get<GridBackground>('gridBackground');

      if (visible) {
        grid.showBackground();
      } else {
        grid.hideBackground();
      }
    });
  }

  runInDiagramContext<T = void>(runner: (diagram: Diagram) => T): T {
    return this.ngZone.runOutsideAngular(() => runner(this.diagram));
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.diagram.destroy());
  }
}
