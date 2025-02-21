import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TableHttpClientService } from './table-http-client.service';
import { Table } from '../models/table.model';
import { cacheObservable } from '../../core/persistence/cache-observable.fn';
import { TableRelationships } from '../models/table-relationships.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {

  private tableHttpClient = inject(TableHttpClientService);

  getTableNames(projectId: string): Observable<string[]> {
    return this.tableHttpClient.getTableNames(projectId);
  }

  getTableDetails = cacheObservable((projectId: string, tableName: string): Observable<Table | null> => {
    return this.tableHttpClient.getTable(projectId, tableName);
  });

  getRelatedTables = cacheObservable((projectId: string, tableName: string): Observable<TableRelationships> => {
    return this.tableHttpClient.getRelatedTables(projectId, tableName).pipe(
      tap(tableRelationships => this.updateCachedTableDetails(projectId, tableRelationships)),
    );
  });

  getTableDdl = cacheObservable((projectId: string, tableName: string): Observable<string> => {
    return this.tableHttpClient.getTableDdl(projectId, tableName);
  });

  private updateCachedTableDetails(projectId: string, tableRelationships: TableRelationships): void {
    tableRelationships.tables.forEach(table => {
      this.getTableDetails.invalidate(projectId, table.name);
      this.getTableDetails.add(table, projectId, table.name);
    });
  }

}
