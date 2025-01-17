import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableColumn } from '../../../models/table-column.model';
import { TableConstraintAffectedColumnsComponent } from '../table-constraint-affected-columns/table-constraint-affected-columns.component';

@Component({
  selector: 'app-table-constraint-primary-key',
  template: `<app-table-constraint-affected-columns [columns]="affectedColumns()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableConstraintAffectedColumnsComponent],
})
export class TableConstraintPrimaryKeyComponent {
  affectedColumns = input.required<TableColumn[]>();
}
