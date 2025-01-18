import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OracleTypeIconComponent } from '../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { TableColumnService } from '../../services/table-column.service';
import { TableConstraintIconComponent } from '../table-constraint-icon/table-constraint-icon.component';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';

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

  table = inject(ROUTER_OUTLET_DATA) as Signal<Table | null>;
  tableColumns = computed(() => this.table()?.columns ?? []);
  private tableColumnService = inject(TableColumnService);

  primaryKeyColumns = computed(() => {
    const table = this.table();
    const pkColumns = table ? this.tableColumnService.getPrimaryKeyColumns(table) : [];
    return pkColumns.map(column => column.name);
  });
}
