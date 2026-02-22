import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class LogicalRelationshipHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  createRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return of(relationship).pipe(delay(1500));
  }

  updateRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return of(relationship).pipe(delay(1500));
  }

  deleteRelationship(dataModelId: number, relationshipId: number): Observable<boolean> {
    //return this.httpClient.delete(`/model/${dataModelId}/relationship/${relationshipId}`);
    return of(true).pipe(delay(1500));
  }
}


