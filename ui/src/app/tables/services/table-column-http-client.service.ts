import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableColumnSetUnusedOptions, TableColumnSetUnusedStatus } from '../models/table-column-set-unused.model';

@Injectable({ providedIn: 'root' })
export class TableColumnHttpClientService {

  private httpClient = inject(HttpClient);

  getColumnUnusedAvailability(projectId: string, tableName: string, columnName: string): Observable<TableColumnSetUnusedStatus> {
    return this.httpClient.get<TableColumnSetUnusedStatus>(`/project/${projectId}/table/${tableName}/column/${columnName}/unused/status`);
  }

  previewSqlForSetColumnUnused(projectId: string, options: TableColumnSetUnusedOptions): Observable<string> {
    const { tableName, columnName, cascadeConstraints } = options;
    const url = `/project/${projectId}/table/${tableName}/column/${columnName}/unused/preview`;
    const params = new HttpParams().set('cascadeConstraints', cascadeConstraints);

    return this.httpClient.get(url, { params, responseType: 'text' });
  }

  setColumnUnused(projectId: string, options: TableColumnSetUnusedOptions): Observable<unknown> {
    const { tableName, columnName, cascadeConstraints } = options;
    const url = `/project/${projectId}/table/${tableName}/column/${columnName}/unused`;
    const data = { cascadeConstraints };
    return this.httpClient.post(url, data);
  }

}
