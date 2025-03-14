import { DestroyRef, Directive, effect, ElementRef, inject, Renderer2 } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appFullscreen]',
  exportAs: 'appFullscreen'
})
export class FullscreenDirective {

  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);
  private fullscreenService = inject(FullscreenService);
  private renderer2 = inject(Renderer2);

  readonly isActive = this.fullscreenService.isFullscreen;
  readonly isAvailable = this.fullscreenService.fullscreenSupported;

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.markFullscreen();
      } else {
        this.unmarkFullscreen();
      }
    });
  }

  toggle(): void {
    const fullscreen$ = this.fullscreenService.isFullscreen()
      ? this.fullscreenService.exitFullscreen()
      : this.fullscreenService.requestFullscreen(this.elementRef.nativeElement);

    fullscreen$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private markFullscreen(): void {
    this.renderer2.addClass(this.elementRef.nativeElement, 'fullscreen');
  }

  private unmarkFullscreen(): void {
    this.renderer2.removeClass(this.elementRef.nativeElement, 'fullscreen');
  }
}
