import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelModificationDto } from '../models/data-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelEdgeHttpClientService {
  private httpClient = inject(HttpClient);

  createEdge(dataModelId: number, edge: DataModelEdge): Observable<DataModelModificationDto> {
    return this.httpClient.post<DataModelModificationDto>(`/model/${dataModelId}/edge`, {
      fromNodeId: edge.fromNodeId,
      toNodeId: edge.toNodeId,
      type: edge.type,
      isMandatory: edge.isMandatory,
      isIdentifying: edge.isIdentifying,
    });
  }

  updateEdge(dataModelId: number, edge: DataModelEdge): Observable<DataModelModificationDto> {
    return this.httpClient.put<DataModelModificationDto>(`/model/${dataModelId}/edge/${edge.edgeId}`, {
      fromNodeId: edge.fromNodeId,
      toNodeId: edge.toNodeId,
      type: edge.type,
      isMandatory: edge.isMandatory,
      isIdentifying: edge.isIdentifying,
      fields: edge.fields,
    });
  }

  deleteEdge(dataModelId: number, edgeId: number): Observable<DataModelModificationDto> {
    return this.httpClient.delete<DataModelModificationDto>(`/model/${dataModelId}/edge/${edgeId}`);
  }
}
