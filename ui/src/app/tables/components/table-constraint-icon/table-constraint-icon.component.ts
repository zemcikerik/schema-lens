import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TableConstraintType } from '../../models/table-constraint.model';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

const TYPE_TO_ICON: Record<TableConstraintType, string> = {
  'primary-key': 'key',
  'foreign-key': 'key_vertical',
  'unique': 'verified',
  'check': 'lock',
};

@Component({
  selector: 'app-table-constraint-icon',
  template: `<mat-icon [matTooltip]="(label() | translate)()">{{ icon() }}</mat-icon>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
    TranslatePipe,
  ],
})
export class TableConstraintIconComponent {
  type = input.required<TableConstraintType>();
  icon = computed(() => TYPE_TO_ICON[this.type()]);
  label = computed(() => `TABLES.CONSTRAINTS.TYPE.${this.type().toUpperCase()}`);
}
