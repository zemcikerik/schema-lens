import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';
import { LogicalRelationshipHttpClientService } from './logical-relationship-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalRelationshipService {
  private httpClient = inject(LogicalRelationshipHttpClientService);

  createRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.httpClient.createRelationship(dataModelId, relationship);
  }

  updateRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.httpClient.updateRelationship(dataModelId, relationship);
  }

  deleteRelationship(dataModelId: number, relationshipId: number): Observable<unknown> {
    return this.httpClient.deleteRelationship(dataModelId, relationshipId);
  }
}


