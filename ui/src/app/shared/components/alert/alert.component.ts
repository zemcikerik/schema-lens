import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

export type AlertType = 'info' | 'error';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon, MatTooltip, TranslatePipe],
})
export class AlertComponent {
  type = input<AlertType>('info');
  showIcon = input<boolean>(true);

  tooltipKey = computed(() =>
    this.type() === 'info'
      ? 'GENERIC.TOOLTIP_INFO_LABEL'
      : 'GENERIC.TOOLTIP_ERROR_LABEL'
  );
}
