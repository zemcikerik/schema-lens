import { Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';

export type IconEmphasis = 'default' | 'high';
export const EMPHASIS_HIGH_CLASS = 'emphasis-high';

@Directive({
  selector: '[appIconEmphasis]',
})
export class IconEmphasisDirective {
  emphasis = input.required<IconEmphasis>({ alias: 'appIconEmphasis' });

  constructor() {
    const elementRef = inject(ElementRef<HTMLElement>);

    effect(() => {
      const emphasis = this.emphasis();

      untracked(() => {
        const classList = elementRef.nativeElement.classList;
        if (emphasis === 'high') {
          classList.add(EMPHASIS_HIGH_CLASS);
        } else {
          classList.remove(EMPHASIS_HIGH_CLASS);
        }
      });
    });
  }
}
