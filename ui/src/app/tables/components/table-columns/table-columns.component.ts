import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OracleTypeIconComponent } from '../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { TableColumnService } from '../../services/table-column.service';
import { TableConstraintIconComponent } from '../table-constraint-icon/table-constraint-icon.component';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { childLoadTableSignal } from '../../child-load-table.signal';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    OracleTypeIconComponent,
    TranslatePipe,
    TableConstraintIconComponent,
    StatusIconComponent,
  ],
})
export class TableColumnsComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'primary-key', 'name', 'type', 'position', 'nullable'];

  projectId = input.required<string>();
  tableName = input.required<string>();
  private tableColumnService = inject(TableColumnService);

  table = childLoadTableSignal(this.projectId, this.tableName);
  tableColumns = computed(() => this.table()?.columns ?? []);

  primaryKeyColumns = computed(() => {
    const table = this.table();
    const pkColumns = table ? this.tableColumnService.getPrimaryKeyColumns(table) : [];
    return pkColumns.map(column => column.name);
  });
}
