import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
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
import type ElementFactory from 'diagram-js/lib/core/ElementFactory';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type { Connection, Shape } from 'diagram-js/lib/model/Types';
import { AngularHostContextModuleFactory } from './angular/angular-host-context.module';
import { UnfocusModule } from './util/unfocus.module';

@Component({
  selector: 'app-diagram-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramHostComponent implements AfterViewInit, OnDestroy {
  modules = input<ModuleDeclaration[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private diagram: Diagram = null!; // initialized after view init
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private canvas: Canvas = null!; // initialized after view init
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private elementFactory: ElementFactory = null!; // initialized after view init

  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    const modules = this.modules();

    const { diagram, canvas, elementFactory } = this.ngZone.runOutsideAngular(() => {
      const diagram = new Diagram({
        canvas: {
          container: this.elementRef.nativeElement,
        },
        modules: [
          BendpointsModule,
          ModelingModule,
          MoveModule,
          MoveCanvasModule,
          ResizeModule,
          RuleModule,
          SelectionModule,
          UnfocusModule,
          ZoomScrollModule,
          AngularHostContextModuleFactory.create({
            ngZone: this.ngZone,
            viewContainerRef: this.viewContainerRef,
          }),
          ...modules,
        ],
      });
      const canvas = diagram.get<Canvas>('canvas');
      const elementFactory = diagram.get<ElementFactory>('elementFactory');

      return { diagram, canvas, elementFactory };
    });

    this.diagram = diagram;
    this.canvas = canvas;
    this.elementFactory = elementFactory;
  }

  addShape(shape: Partial<Shape>): Shape {
    return this.ngZone.runOutsideAngular(() => {
      const createdShape = this.elementFactory.createShape(shape);
      this.canvas.addShape(createdShape);
      return createdShape;
    });
  }

  addConnection(connection: Partial<Connection>): Connection {
    return this.ngZone.runOutsideAngular(() => {
      const createdConnection = this.elementFactory.createConnection(connection);
      this.canvas.addConnection(createdConnection);
      return createdConnection;
    });
  }

  getDiagramRoot(): HTMLElement {
    return this.ngZone.runOutsideAngular(() => this.canvas.getContainer());
  }

  getZoomLevel(): number {
    return this.ngZone.runOutsideAngular(() => this.canvas.zoom());
  }

  setZoomLevel(zoomLevel: number): void {
    this.ngZone.runOutsideAngular(() => this.canvas.zoom(zoomLevel));
  }

  runInDiagramContext<T = void>(runner: (diagram: Diagram) => T): T {
    return this.ngZone.runOutsideAngular(() => runner(this.diagram));
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.diagram.destroy());
  }
}
