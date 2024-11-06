import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TableColumn } from '../../models/table-column.model';
import { TableColumnIconComponent } from '../table-column-icon/table-column-icon.component';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, TableColumnIconComponent],
})
export class TableColumnsComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'name', 'type', 'position', 'nullable'];

  columns: TableColumn[] = [
    { position: 1, name: 'ID', type: 'NUMBER(10)', nullable: false },
    { position: 2, name: 'FIRST_NAME', type: 'VARCHAR2(32)', nullable: false },
    { position: 3, name: 'LAST_NAME', type: 'LONG RAW', nullable: false },
    { position: 4, name: 'TEST_COLUMN1', type: 'DATE', nullable: true },
    { position: 6, name: 'TEST_COLUMN2', type: 'BLOB', nullable: true },
    { position: 7, name: 'TEST_COLUMN3', type: 'ROWID', nullable: true },
    { position: 8, name: 'TEST_COLUMN3', type: 'CUSTOM_OBJECT_TYPE', nullable: true },
  ];
}
