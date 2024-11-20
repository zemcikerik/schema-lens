import { inject, Injectable } from '@angular/core';
import { defer, Observable, shareReplay } from 'rxjs';
import { TableHttpClientService } from './table-http-client.service';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {

  private tableDetailsCache: Partial<Record<string, Observable<Table | null>>> = {};
  private tableHttpClient = inject(TableHttpClientService);

  getTableNames(projectId: string): Observable<string[]> {
    return this.tableHttpClient.getTableNames(projectId);
  }

  getTableDetails(projectId: string, tableName: string): Observable<Table | null> {
    const key = this.getTableDetailsCacheKey(projectId, tableName);

    return defer(() => {
      if (this.tableDetailsCache[key]) {
        return this.tableDetailsCache[key];
      }

      const table$ = this.tableHttpClient.getTable(projectId, tableName).pipe(shareReplay(1));
      this.tableDetailsCache[key] = table$;
      return table$;
    });
  }

  private getTableDetailsCacheKey(projectId: string, tableName: string): string {
    return `${projectId}:${tableName}`;
  }

}
