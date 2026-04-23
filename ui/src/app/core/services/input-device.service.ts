import { DOCUMENT, inject, Injectable, signal, Signal } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class InputDeviceService {
  private document = inject(DOCUMENT);
  readonly isTouchPrimary: Signal<boolean>;

  constructor() {
    const mediaQuery = this.document.defaultView?.matchMedia('(pointer: coarse)');

    this.isTouchPrimary = mediaQuery
      ? toSignal(fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(map(event => event.matches)), {
          initialValue: mediaQuery.matches,
        })
      : signal(false).asReadonly();
  }
}
