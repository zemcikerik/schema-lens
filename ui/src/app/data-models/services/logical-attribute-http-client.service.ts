import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogicalAttribute } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class LogicalAttributeHttpClientService {
  private httpClient = inject(HttpClient);

  createAttribute(modelId: number, entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.httpClient.post<LogicalAttribute>(
      `/model/${modelId}/entity/${entityId}/attribute`,
      attribute,
    );
  }

  updateAttribute(modelId: number, entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.httpClient.put<LogicalAttribute>(
      `/model/${modelId}/entity/${entityId}/attribute/${attribute.attributeId}`,
      attribute,
    );
  }

  deleteAttribute(modelId: number, entityId: number, attributeId: number): Observable<unknown> {
    return this.httpClient.delete(
      `/model/${modelId}/entity/${entityId}/attribute/${attributeId}`,
    );
  }
}
