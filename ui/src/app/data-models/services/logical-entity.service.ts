import { inject, Injectable } from '@angular/core';
import { LogicalEntity } from '../models/logical-model.model';
import { LogicalEntityHttpClientService } from './logical-entity-http-client.service';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogicalEntityService {
  entityUpdated$ = new Subject<LogicalEntity>();
  entityDeleted$ = new Subject<number>();
  entityCreated$ = new Subject<LogicalEntity>();

  private logicalEntityHttpClient = inject(LogicalEntityHttpClientService);

  updateLogicalEntity = (modelId: number, entity: LogicalEntity) => {
    this.updateAttributePositions(entity);
    return this.logicalEntityHttpClient.updateLogicalEntity(modelId, entity).pipe(tap(e => this.entityUpdated$.next(e)));
  };

  deleteLogicalEntity = (modelId: number, entityId: number) =>
    this.logicalEntityHttpClient.deleteLogicalEntity(modelId, entityId).pipe(tap(() => this.entityDeleted$.next(entityId)));

  createLogicalEntity = (modelId: number, entity: LogicalEntity) =>
    this.logicalEntityHttpClient.createLogicalEntity(modelId, entity).pipe(tap(e => this.entityCreated$.next(e)));

  private updateAttributePositions = (entity: LogicalEntity) => {
    let i = 0;
    entity.attributes.map(a => (a.position = i++));
  };
}
