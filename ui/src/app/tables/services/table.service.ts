import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpClientService } from './table-http-client.service';
import { Table } from '../models/table.model';
import { cacheObservable } from '../../core/persistence/cache-observable.fn';
import { TableCacheService } from './table-cache.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TableService {

  private tableHttpClient = inject(TableHttpClientService);

  constructor() {
    inject(TableCacheService).invalidateTable$
      .pipe(takeUntilDestroyed())
      .subscribe(({ projectId, tableName }) => this.invalidateTableEntry(projectId, tableName));
  }

  getTableNames = cacheObservable((projectId: string): Observable<string[]> => {
    return this.tableHttpClient.getTableNames(projectId);
  });

  getTableDetails = cacheObservable((projectId: string, tableName: string): Observable<Table | null> => {
    return this.tableHttpClient.getTable(projectId, tableName);
  });

  getTableDdl = cacheObservable((projectId: string, tableName: string): Observable<string> => {
    return this.tableHttpClient.getTableDdl(projectId, tableName);
  });

  private invalidateTableEntry(projectId: string, tableName: string): void {
    this.getTableDetails.invalidate(projectId, tableName);
    this.getTableDdl.invalidate(projectId, tableName);
  }
}
