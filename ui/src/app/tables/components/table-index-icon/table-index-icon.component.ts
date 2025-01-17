import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TableIndexType } from '../../models/table-index.model';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { IndexTypeToLabelPipe } from '../../pipes/index-type-to-label-pipe';

const INDEX_TYPE_TO_ICON: Record<TableIndexType, string> = {
  [TableIndexType.NORMAL]: 'list',
  [TableIndexType.NORMAL_REVERSE]: 'list',
  [TableIndexType.BITMAP]: 'toggle_on',
  [TableIndexType.FUNCTION_NORMAL]: 'list',
  [TableIndexType.FUNCTION_NORMAL_REVERSE]: 'list',
  [TableIndexType.FUNCTION_BITMAP]: 'toggle_on',
};

@Component({
  selector: 'app-table-index-icon',
  template: `
    <mat-icon [matTooltip]="(type() | indexTypeToLabel | translate)()">{{ icon() }}</mat-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    MatTooltip,
    TranslatePipe,
    IndexTypeToLabelPipe,
  ],
})
export class TableIndexIconComponent {
  type = input.required<TableIndexType>();
  icon = computed(() => INDEX_TYPE_TO_ICON[this.type()]);
}
