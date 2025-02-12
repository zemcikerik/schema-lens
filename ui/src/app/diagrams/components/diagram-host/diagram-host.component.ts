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
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ResizeModule from 'diagram-js/lib/features/resize';
import RuleModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import AngularHostContextModuleFactory from '../../modules/angular-host-context.module';
import type { ModuleDeclaration } from 'didi';
import type ElementFactory from 'diagram-js/lib/core/ElementFactory';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type { Shape } from 'diagram-js/lib/model/Types';

@Component({
  selector: 'app-diagram-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramHostComponent implements AfterViewInit, OnDestroy {
  modules = input<ModuleDeclaration[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private diagram: Diagram = null!; // initialized after view init
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    const modules = this.modules();

    this.diagram = this.ngZone.runOutsideAngular(() => new Diagram({
      canvas: {
        container: this.elementRef.nativeElement,
      },
      modules: [
        ModelingModule,
        MoveModule,
        MoveCanvasModule,
        ResizeModule,
        RuleModule,
        SelectionModule,
        ZoomScrollModule,
        AngularHostContextModuleFactory.create({
          ngZone: this.ngZone,
          viewContainerRef: this.viewContainerRef,
        }),
        ...modules,
      ],
    }));
  }

  addShape(shape: Partial<Shape>): Shape {
    return this.ngZone.runOutsideAngular(() => {
      const canvas = this.diagram.get('canvas') as Canvas;
      const elementFactory = this.diagram.get('elementFactory') as ElementFactory;

      const createdShape = elementFactory.createShape(shape);
      canvas.addShape(createdShape);

      return createdShape;
    });
  }

  runInDiagramContext<T = void>(runner: (diagram: Diagram) => T): T {
    return this.ngZone.runOutsideAngular(() => runner(this.diagram));
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.diagram.destroy());
  }
}
