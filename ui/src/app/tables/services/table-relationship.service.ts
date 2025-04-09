import { inject, Injectable } from '@angular/core';
import { TableRelationshipHttpClientService } from './table-relationship-http-client.service';
import { Observable } from 'rxjs';
import { TableRelationships } from '../models/table-relationships.model';

@Injectable({ providedIn: 'root' })
export class TableRelationshipService {

  private tableRelationshipHttpClient = inject(TableRelationshipHttpClientService);

  getRelationshipsOfTable(projectId: string, tableName: string): Observable<TableRelationships | null> {
    return this.tableRelationshipHttpClient.getRelationshipsOfTable(projectId, tableName);
  }

  getRelationshipsOfTables(projectId: string, tableNames: string[]): Observable<TableRelationships | null> {
    return this.tableRelationshipHttpClient.getRelationshipsOfTables(projectId, tableNames);
  }

}
