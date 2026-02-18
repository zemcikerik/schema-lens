import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';
import { DataModelRelationshipHttpClientService } from './data-model-relationship-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelRelationshipService {
  private relationshipHttpClient = inject(DataModelRelationshipHttpClientService);

  createRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.relationshipHttpClient.createRelationship(dataModelId, relationship);
  }

  updateRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<LogicalRelationship> {
    return this.relationshipHttpClient.updateRelationship(dataModelId, relationship);
  }

  deleteRelationship(dataModelId: number, relationship: LogicalRelationship): Observable<boolean> {
    return this.relationshipHttpClient.deleteRelationship(dataModelId, relationship);
  }
}
