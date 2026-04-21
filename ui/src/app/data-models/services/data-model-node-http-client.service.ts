import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModelFieldReorderRequest, DataModelNode, DataModelNodeSummary } from '../models/data-model-node.model';
import { DataModelModification } from '../models/data-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelNodeHttpClientService {
  private httpClient = inject(HttpClient);

  createNode(modelId: number, node: DataModelNodeSummary): Observable<DataModelNode> {
    return this.httpClient.post<DataModelNode>(`/model/${modelId}/node`, {
      name: node.name,
      fields: [],
    });
  }

  updateNode(modelId: number, node: DataModelNode): Observable<DataModelModification> {
    return this.httpClient.put<DataModelModification>(`/model/${modelId}/node/${node.nodeId}`, node);
  }

  deleteNode(modelId: number, nodeId: number): Observable<DataModelModification> {
    return this.httpClient.delete<DataModelModification>(`/model/${modelId}/node/${nodeId}`);
  }

  reorderNodeFields(modelId: number, nodeId: number, request: DataModelFieldReorderRequest): Observable<DataModelModification> {
    return this.httpClient.put<DataModelModification>(
      `/model/${modelId}/node/${nodeId}/fields/reorder`,
      request,
    );
  }
}
