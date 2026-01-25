import { Directive, ElementRef, inject, input } from '@angular/core';
import { HorizontalResizerTarget } from '../directives/horizontal-resizer.directive';

@Directive({
  selector: '[appSidebarResizeTarget]',
  exportAs: 'sidebarResizeTarget',
})
export class SidebarResizeTargetDirective implements HorizontalResizerTarget {
  widthCssProperty = input.required<string>();
  widthCssPropertyTarget = input.required<HTMLElement>();
  private elementRef = inject(ElementRef);

  getWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  setWidth(width: number): void {
    this.widthCssPropertyTarget().style.setProperty(this.widthCssProperty(), `${width}px`);
  }
}
