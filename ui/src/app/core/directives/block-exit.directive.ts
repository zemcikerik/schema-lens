import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appBlockExit]',
  host: {
    '(window:beforeunload)': 'beforeUnload($event)',
  },
})
export class BlockExitDirective {
  appBlockExit = input<boolean>(true);

  beforeUnload(event: BeforeUnloadEvent): void {
    if (this.appBlockExit()) {
      event.preventDefault();
      // noinspection JSDeprecatedSymbols
      event.returnValue = '';
    }
  }
}
