import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpClientService } from './table-http-client.service';
import { Table } from '../models/table.model';
import { cacheObservable } from '../../core/persistence/cache-observable.fn';

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

}
