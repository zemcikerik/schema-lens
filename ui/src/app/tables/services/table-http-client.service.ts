import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Table } from '../models/table.model';
import { catch404StatusError } from '../../core/rxjs-pipes';

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
      catch404StatusError(() => of(null)),
    );
  }

}
