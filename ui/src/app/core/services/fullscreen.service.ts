import { inject, Injectable, Signal, DOCUMENT } from '@angular/core';
import { defer, fromEvent, map, Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FullscreenService {

  readonly fullscreenSupported: boolean;
  readonly isFullscreen: Signal<boolean>;

  private document = inject(DOCUMENT);

  constructor() {
    this.fullscreenSupported = this.document.fullscreenEnabled;

    this.isFullscreen = toSignal(fromEvent(this.document, 'fullscreenchange').pipe(
      map(() => this.document.fullscreenElement !== null),
    ), { initialValue: false });
  }

  requestFullscreen(element: HTMLElement): Observable<unknown> {
    return this.fullscreenSupported ? defer(() => element.requestFullscreen()) : of(false);
  }

  exitFullscreen(): Observable<unknown> {
    return this.fullscreenSupported ? defer(() => this.document.exitFullscreen()) : of(false);
  }
}
