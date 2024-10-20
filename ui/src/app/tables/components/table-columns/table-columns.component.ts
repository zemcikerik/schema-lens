import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { TableColumn } from '../../models/table-column.model';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, MatIcon],
})
export class TableColumnsComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'order', 'name', 'type'];

  columns: TableColumn[] = [
    {order: 1, name: 'ID', type: 'NUMBER(10)'},
    {order: 2, name: 'FIRST_NAME', type: 'VARCHAR2(32)'},
    {order: 3, name: 'LAST_NAME', type: 'VARCHAR2(32)'},
    {order: 4, name: 'TEST_COLUMN1', type: 'VARCHAR2(32)'},
    {order: 6, name: 'TEST_COLUMN2', type: 'VARCHAR2(32)'},
    {order: 7, name: 'TEST_COLUMN3', type: 'VARCHAR2(32)'},
  ];
}
