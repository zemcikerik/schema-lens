import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class LogicalRelationshipHttpClientService {
  private httpClient = inject(HttpClient);

  createRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.httpClient.post<LogicalRelationship>(
      `/model/${dataModelId}/relationship`,
      relationship,
    );
  }

  updateRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.httpClient.put<LogicalRelationship>(
      `/model/${dataModelId}/relationship/${relationship.relationshipId}`,
      relationship,
    );
  }

  deleteRelationship(dataModelId: number, relationshipId: number): Observable<unknown> {
    return this.httpClient.delete(`/model/${dataModelId}/relationship/${relationshipId}`);
  }
}
