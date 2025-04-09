import { inject, Injectable } from '@angular/core';
import { TableColumn } from '../models/table-column.model';
import { Table } from '../models/table.model';
import { TableConstraintType } from '../models/table-constraint.model';
import { TableColumnSetUnusedOptions, TableColumnSetUnusedStatus } from '../models/table-column-set-unused.model';
import { Observable, tap } from 'rxjs';
import { TableColumnHttpClientService } from './table-column-http-client.service';
import { TableCacheService } from './table-cache.service';

@Injectable({ providedIn: 'root' })
export class TableColumnService {

  private tableColumnHttpClient = inject(TableColumnHttpClientService);
  private tableCacheService = inject(TableCacheService);

  getPrimaryKeyColumns(table: Table): TableColumn[] {
    const constraint = table.constraints.find(c => c.type === TableConstraintType.PRIMARY_KEY) ?? null;
    return constraint ? table.columns.filter(column => constraint.columnNames.includes(column.name)) : [];
  }

  getUniqueColumnGroupNamesWithoutPrimaryKey(table: Table): string[][] {
    return table.constraints
      .filter(c => c.type === TableConstraintType.UNIQUE)
      .map(c => c.columnNames);
  }

  getColumnUnusedAvailability(projectId: string, tableName: string, columnName: string): Observable<TableColumnSetUnusedStatus> {
    return this.tableColumnHttpClient.getColumnUnusedAvailability(projectId, tableName, columnName);
  }

  previewSqlForSetColumnUnused(projectId: string, options: TableColumnSetUnusedOptions): Observable<string> {
    return this.tableColumnHttpClient.previewSqlForSetColumnUnused(projectId, options);
  }

  setColumnUnused(projectId: string, options: TableColumnSetUnusedOptions): Observable<unknown> {
    return this.tableColumnHttpClient.setColumnUnused(projectId, options).pipe(
      tap(() => this.tableCacheService.invalidateTable(projectId, options.tableName)),
    );
  }

}
