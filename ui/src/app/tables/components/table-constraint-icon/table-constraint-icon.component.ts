import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TableConstraintType } from '../../models/table-constraint.model';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ConstraintTypeToLabelPipe } from '../../pipes/constraint-type-to-label.pipe';

const TYPE_TO_ICON: Record<TableConstraintType, string> = {
  [TableConstraintType.PRIMARY_KEY]: 'key',
  [TableConstraintType.FOREIGN_KEY]: 'key_vertical',
  [TableConstraintType.UNIQUE]: 'verified',
  [TableConstraintType.CHECK]: 'lock',
};

@Component({
  selector: 'app-table-constraint-icon',
  template: `<mat-icon [matTooltip]="(type() | constraintTypeToLabel | translate)()">{{ icon() }}</mat-icon>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
    TranslatePipe,
    ConstraintTypeToLabelPipe,
  ],
})
export class TableConstraintIconComponent {
  type = input.required<TableConstraintType | `${TableConstraintType}`>();
  icon = computed(() => TYPE_TO_ICON[this.type()]);
}
