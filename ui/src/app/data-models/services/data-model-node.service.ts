import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelFieldReorderRequest, DataModelModification, DataModelNode, DataModelNodeSummary } from '../models/data-model-types.model';
import { DataModelNodeHttpClientService } from './data-model-node-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelNodeService {
  private httpClient = inject(DataModelNodeHttpClientService);

  createNode(modelId: number, node: DataModelNodeSummary): Observable<DataModelNode> {
    return this.httpClient.createNode(modelId, node);
  }

  updateNode(modelId: number, node: DataModelNode): Observable<DataModelModification> {
    return this.httpClient.updateNode(modelId, node);
  }

  deleteNode(modelId: number, nodeId: number): Observable<DataModelModification> {
    return this.httpClient.deleteNode(modelId, nodeId);
  }

  reorderNodeFields(modelId: number, nodeId: number, request: DataModelFieldReorderRequest): Observable<DataModelModification> {
    return this.httpClient.reorderNodeFields(modelId, nodeId, request);
  }
}
