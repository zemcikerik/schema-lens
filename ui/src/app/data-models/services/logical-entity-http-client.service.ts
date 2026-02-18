import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { LogicalEntity } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class LogicalEntityHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  updateLogicalEntity = (modelId: number, entity: LogicalEntity) => {
    return of(entity).pipe(delay(1500));
  };

  deleteLogicalEntity = (modelId: number, entityId: number): Observable<boolean> => {
    return of(true).pipe(delay(1500));
  };

  createLogicalEntity = (modelId: number, entity: LogicalEntity) => {
    return of({ name: entity.name, entityId: 0, attributes: [] }).pipe(delay(1500));
  };
}