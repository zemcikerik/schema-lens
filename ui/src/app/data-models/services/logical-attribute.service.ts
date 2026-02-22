import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalAttribute } from '../models/logical-model.model';
import { LogicalAttributeHttpClientService } from './logical-attribute-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalAttributeService {
  private httpClient = inject(LogicalAttributeHttpClientService);

  createAttribute(modelId: number, entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.httpClient.createAttribute(modelId, entityId, attribute);
  }

  updateAttribute(modelId: number, entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.httpClient.updateAttribute(modelId, entityId, attribute);
  }

  deleteAttribute(modelId: number, entityId: number, attributeId: number): Observable<unknown> {
    return this.httpClient.deleteAttribute(modelId, entityId, attributeId);
  }
}
