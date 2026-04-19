import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelModificationDto } from '../models/data-model.model';
import { DataModelEdgeHttpClientService } from './data-model-edge-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelEdgeService {
  private httpClient = inject(DataModelEdgeHttpClientService);

  createEdge(dataModelId: number, edge: DataModelEdge): Observable<DataModelModificationDto> {
    return this.httpClient.createEdge(dataModelId, edge);
  }

  updateEdge(dataModelId: number, edge: DataModelEdge): Observable<DataModelModificationDto> {
    return this.httpClient.updateEdge(dataModelId, edge);
  }

  deleteEdge(dataModelId: number, edgeId: number): Observable<DataModelModificationDto> {
    return this.httpClient.deleteEdge(dataModelId, edgeId);
  }
}
