import { DestroyRef, Directive, DOCUMENT, inject, input } from '@angular/core';
import { fromEvent } from 'rxjs';

export interface HorizontalResizerTarget {
  getWidth(): number;
  setWidth(width: number): void;
}

@Directive({
  selector: '[appHorizontalResizer]',
  host: {
    '(mousedown)': 'handleDrag($event)',
  },
})
export class HorizontalResizerDirective {
  appHorizontalResizer = input.required<HorizontalResizerTarget>();
  resizerReverse = input<boolean>(false);

  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  handleDrag(event: MouseEvent): void {
    const startWidth = this.appHorizontalResizer().getWidth();
    const startX = event.clientX;
    const direction = this.resizerReverse() ? -1 : 1;

    const subscription = fromEvent(this.document, 'mousemove').subscribe(event => {
      this.appHorizontalResizer().setWidth(Math.max(startWidth + direction * ((event as MouseEvent).clientX - startX), 0));
    });

    subscription.add(fromEvent(this.document, 'mouseup').subscribe(() => {
      subscription.unsubscribe();
    }));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
