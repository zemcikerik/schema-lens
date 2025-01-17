import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TableIndex, TableIndexColumn, TableIndexColumnDirection } from '../../models/table-index.model';
import { TableColumn } from '../../models/table-column.model';
import { OracleTypeIconComponent } from '../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

interface IncludedColumn {
  dataType: string | null;
  value: string;
  direction: TableIndexColumnDirection;
}

@Component({
  selector: 'app-table-index',
  templateUrl: './table-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OracleTypeIconComponent,
    MatIcon,
    MatTooltip,
    TranslatePipe,
  ],
})
export class TableIndexComponent {
  index = input.required<TableIndex>();
  columns = input.required<TableColumn[]>();

  includedColumns = computed<IncludedColumn[]>(() => {
    const tableColumns = this.columns();

    return this.index().columns.map(column => column.expression
      ? { dataType: null, value: column.expression, direction: column.direction }
      : this.mapToIncludedColumn(column, tableColumns));
  });

  private mapToIncludedColumn({ name, direction }: TableIndexColumn, tableColumns: TableColumn[]): IncludedColumn {
    const tableColumn = tableColumns.find(c => c.name === name);
    return { dataType: tableColumn?.type ?? '', value: name, direction };
  }
}
