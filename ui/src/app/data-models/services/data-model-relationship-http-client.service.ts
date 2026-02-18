import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelRelationshipHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  createRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    const rel = structuredClone(relationship);
    rel.relationshipId = 0;
    return of(rel).pipe(delay(1500));
  }

  updateRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return of(relationship).pipe(delay(1500));
  }

  deleteRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<boolean> {
    return of(true).pipe(delay(1500));
  }
}
