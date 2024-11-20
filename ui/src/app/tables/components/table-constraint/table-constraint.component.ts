import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CheckTableConstraint, ForeignKeyTableConstraint, TableConstraint } from '../../models/table-constraint.model';
import { TableColumn } from '../../models/table-column.model';
import { TableConstraintPrimaryKeyComponent } from './table-constraint-primary-key/table-constraint-primary-key.component';
import { TableConstraintForeignKeyComponent } from './table-constraint-foreign-key/table-constraint-foreign-key.component';
import { TableConstraintUniqueComponent } from './table-constraint-unique/table-constraint-unique.component';
import { TableConstraintCheckComponent } from './table-constraint-check/table-constraint-check.component';

@Component({
  selector: 'app-table-constraint',
  templateUrl: './table-constraint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TableConstraintPrimaryKeyComponent,
    TableConstraintForeignKeyComponent,
    TableConstraintUniqueComponent,
    TableConstraintCheckComponent,
  ],
})
export class TableConstraintComponent {
  constraint = input.required<TableConstraint>();
  columns = input.required<TableColumn[]>();

  affectedColumns = computed(() => {
    const { columnNames } = this.constraint();
    return this.columns().filter(c => columnNames.includes(c.name));
  });

  isForeignKeyConstraint(constraint: TableConstraint): constraint is ForeignKeyTableConstraint {
    return constraint.type === 'foreign-key';
  }

  isCheckConstraint(constraint: TableConstraint): constraint is CheckTableConstraint {
    return constraint.type === 'check';
  }
}
