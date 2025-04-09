import { inject, Injectable } from "@angular/core";
import { TableRelationships } from '../models/table-relationships.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({ providedIn: 'root' })
export class TableRelationshipHttpClientService {

  private httpClient = inject(HttpClient);

  getRelationshipsOfTable(projectId: string, tableName: string): Observable<TableRelationships | null> {
    return this.httpClient.get<TableRelationships>(`/project/${projectId}/table/${tableName}/related`).pipe(
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }

  getRelationshipsOfTables(projectId: string, tableNames: string[]): Observable<TableRelationships | null> {
    const params = tableNames.reduce((params, table) => params.append('tableNames[]', table), new HttpParams());

    return this.httpClient.get<TableRelationships>(`/project/${projectId}/table-relationships`, { params }).pipe(
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }

}
