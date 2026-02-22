import { inject, Injectable } from '@angular/core';
import { LogicalEntitySummary } from '../models/logical-model.model';
import { LogicalEntityHttpClientService } from './logical-entity-http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogicalEntityService {
  private httpClient = inject(LogicalEntityHttpClientService);

  createEntity(modelId: number, entity: LogicalEntitySummary): Observable<LogicalEntitySummary> {
    return this.httpClient.createEntity(modelId, entity);
  }

  updateEntity(modelId: number, entity: LogicalEntitySummary): Observable<LogicalEntitySummary> {
    return this.httpClient.updateEntity(modelId, entity);
  }

  deleteEntity(modelId: number, entityId: number): Observable<unknown> {
    return this.httpClient.deleteEntity(modelId, entityId);
  }
}
