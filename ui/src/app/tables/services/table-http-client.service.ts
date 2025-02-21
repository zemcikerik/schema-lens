import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Table } from '../models/table.model';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';
import { TableRelationships } from '../models/table-relationships.model';

@Injectable({
  providedIn: 'root'
})
export class TableHttpClientService {

  private httpClient = inject(HttpClient);

  getTableNames(projectId: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`/project/${projectId}/table`);
  }

  getTable(projectId: string, tableName: string): Observable<Table | null> {
    return this.httpClient.get<Table>(`/project/${projectId}/table/${tableName}`).pipe(
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }

  getRelatedTables(projectId: string, tableName: string): Observable<TableRelationships> {
    return this.httpClient.get<TableRelationships>(`/project/${projectId}/table/${tableName}/related`);
  }

  getTableDdl(projectId: string, tableName: string): Observable<string> {
    return this.httpClient.get(`/project/${projectId}/table/${tableName}/ddl`, { responseType: 'text' });
  }
}
