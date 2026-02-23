import { AfterViewInit, Directive, ElementRef, inject, input, output } from '@angular/core';

@Directive({
  selector: '[appFocusLeft]',
  host: {
    '(focusout)': 'onFocusOut($event)',
  },
})
export class FocusLeftDirective implements AfterViewInit {
  allowOverlayFocus = input<boolean>(true);
  focusLeft = output<FocusEvent>();
  private elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    const element: HTMLElement = this.elementRef.nativeElement;
    if (!element.hasAttribute('tabindex')) {
      element.tabIndex = 0;
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this.isFocusTargetAllowed(event.relatedTarget)) {
      this.focusLeft.emit(event);
    }
  }

  private isFocusTargetAllowed(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
      return false;
    }

    return (
      this.elementRef.nativeElement.contains(target) ||
      (this.allowOverlayFocus() && target.closest('.cdk-overlay-container') !== null)
    );
  }
}
