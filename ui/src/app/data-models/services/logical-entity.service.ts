import { inject, Injectable } from '@angular/core';
import { LogicalEntity } from '../models/logical-model.model';
import { LogicalEntityHttpClientService } from './logical-entity-http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogicalEntityService {
  private httpClient = inject(LogicalEntityHttpClientService);

  createEntity(modelId: number, entity: LogicalEntity): Observable<LogicalEntity> {
    return this.httpClient.createEntity(modelId, entity);
  }

  updateEntity(modelId: number, entity: LogicalEntity): Observable<LogicalEntity> {
    this.normalizeAttributePositions(entity);
    return this.httpClient.updateEntity(modelId, entity);
  }

  deleteEntity(modelId: number, entityId: number): Observable<boolean> {
    return this.httpClient.deleteEntity(modelId, entityId);
  }

  // TODO: move
  private normalizeAttributePositions(entity: LogicalEntity): void {
    entity.attributes.forEach((a, i) => (a.position = i));
  }
}
