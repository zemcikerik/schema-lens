import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FullscreenDirective } from '../core/directives/fullscreen.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../core/translate/translate.pipe';

@Component({
  selector: 'app-diagram-fullscreen-control',
  template: `
    <div class="diagram-fullscreen">
      <button
        mat-icon-button
        [disabled]="!fullscreenHost().isAvailable"
        [matTooltip]="(tooltipKey() | translate)()"
        (click)="fullscreenHost().toggle()"
      >
        <mat-icon>{{ icon() }}</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class DiagramFullscreenControlComponent {
  fullscreenHost = input.required<FullscreenDirective>();
  tooltipKey = computed(() => `DIAGRAM.FULLSCREEN_${this.getFullscreenStateKey(this.fullscreenHost())}_LABEL`);
  icon = computed(() => this.fullscreenHost().isActive() ? 'close_fullscreen' : 'open_in_full');

  private getFullscreenStateKey(host: FullscreenDirective): string {
    if (!host.isAvailable) {
      return 'UNAVAILABLE';
    }
    return host.isActive() ? 'EXIT' : 'ENTER';
  }
}
