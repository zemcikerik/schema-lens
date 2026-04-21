import { Directive, DOCUMENT, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, filter, fromEvent, switchMap } from 'rxjs';

@Directive({
  selector: '[appTrapClicks]',
})
export class TrapClicksDirective {
  appTrapClicks = input<boolean>(true);
  allowOverlayClicks = input<boolean>(true);
  clickTrapped = output();

  private elementRef = inject(ElementRef);

  constructor() {
    const document = inject(DOCUMENT);
    const trapClicks$ = toObservable(this.appTrapClicks);

    const trapEvent = (eventName: string, callbackAction?: () => void): void => {
      trapClicks$.pipe(
        switchMap(trapClicks => trapClicks ? fromEvent(document, eventName, { capture: true }) : EMPTY),
        filter(event => !event.target || !this.isEventTargetAllowed(event.target)),
        takeUntilDestroyed(),
      ).subscribe(event => {
        event.preventDefault();
        event.stopPropagation();
        callbackAction?.();
      });
    };

    trapEvent('mousedown');
    trapEvent('click', () => this.clickTrapped.emit());
  }

  private isEventTargetAllowed(target: EventTarget): boolean {
    if (!(target instanceof Element)) {
      return false;
    }

    return this.elementRef.nativeElement.contains(target)
      || (this.allowOverlayClicks() && target.closest('.cdk-overlay-container') !== null);
  }
}
