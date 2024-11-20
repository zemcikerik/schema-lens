import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableConstraintAffectedColumnsComponent } from '../table-constraint-affected-columns/table-constraint-affected-columns.component';
import { TableColumn } from '../../../models/table-column.model';

@Component({
  selector: 'app-table-constraint-unique',
  template: `<app-table-constraint-affected-columns [columns]="affectedColumns()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TableConstraintAffectedColumnsComponent],
})
export class TableConstraintUniqueComponent {
  affectedColumns = input.required<TableColumn[]>();
}
