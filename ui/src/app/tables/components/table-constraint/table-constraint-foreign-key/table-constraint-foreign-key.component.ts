import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { ForeignKeyTableConstraint } from '../../../models/table-constraint.model';
import { TableColumn } from '../../../models/table-column.model';
import { MatTableModule } from '@angular/material/table';
import { OracleTypeIconComponent } from '../../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

type TableColumnWithReferencedName = TableColumn & { referencedColumnName: string };

@Component({
  selector: 'app-table-constraint-foreign-key',
  templateUrl: './table-constraint-foreign-key.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    OracleTypeIconComponent,
    TranslatePipe,
  ],
})
export class TableConstraintForeignKeyComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'name', 'referencedConstraintName', 'referencedTableName', 'referencedColumnName'];
  
  constraint = input.required<ForeignKeyTableConstraint>();
  affectedColumns = input.required<TableColumn[]>();

  columnsWithReferencedNames: Signal<TableColumnWithReferencedName[]> = computed(() => {
    const { name, references } = this.constraint();
    const columns = this.affectedColumns();

    return references.map(({ columnName, referencedColumnName }) => {
      const column = columns.find(c => c.name === columnName);

      if (column === undefined) {
        throw new Error(`Column '${columnName}' in foreign key constraint '${name}' was not found in provided columns!`);
      }

      return { ...column, referencedColumnName };
    });
  });
}
