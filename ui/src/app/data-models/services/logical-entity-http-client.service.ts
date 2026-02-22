import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogicalEntitySummary } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class LogicalEntityHttpClientService {
  private httpClient = inject(HttpClient);

  createEntity(modelId: number, entity: LogicalEntitySummary): Observable<LogicalEntitySummary> {
    return this.httpClient.post<LogicalEntitySummary>(`/model/${modelId}/entity`, { name: entity.name });
  }

  updateEntity(modelId: number, entity: LogicalEntitySummary): Observable<LogicalEntitySummary> {
    return this.httpClient.put<LogicalEntitySummary>(`/model/${modelId}/entity/${entity.entityId}`, { name: entity.name });
  }

  deleteEntity(modelId: number, entityId: number): Observable<unknown> {
    return this.httpClient.delete(`/model/${modelId}/entity/${entityId}`);
  }
}
