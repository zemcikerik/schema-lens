import { inject, Injectable } from "@angular/core";
import { TableRelationships } from '../models/table-relationships.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableRelationshipHttpClientService {

  private httpClient = inject(HttpClient);

  getRelationshipsOfTable(projectId: string, tableName: string): Observable<TableRelationships> {
    return this.httpClient.get<TableRelationships>(`/project/${projectId}/table/${tableName}/related`);
  }

  getRelationshipsOfTables(projectId: string, tableNames: string[]): Observable<TableRelationships> {
    const params = tableNames.reduce((params, table) => params.append('tableNames[]', table), new HttpParams());
    return this.httpClient.get<TableRelationships>(`/project/${projectId}/table-relationships`, { params });
  }

}
