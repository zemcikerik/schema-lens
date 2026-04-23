import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

export type AlertType = 'info' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip, TranslatePipe],
})
export class AlertComponent {
  type = input<AlertType>('info');
  showIcon = input<boolean>(true);

  tooltipKey = computed(() => {
    switch (this.type()) {
      case 'info': return 'GENERIC.TOOLTIP_INFO_LABEL';
      case 'warning': return 'GENERIC.TOOLTIP_WARNING_LABEL';
      case 'error': return 'GENERIC.TOOLTIP_ERROR_LABEL';
    }
  });
}
