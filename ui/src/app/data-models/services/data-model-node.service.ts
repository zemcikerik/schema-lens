import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelFieldReorderRequest, DataModelNode, DataModelNodeSummary } from '../models/data-model-node.model';
import { DataModelModificationDto } from '../models/data-model.model';
import { DataModelNodeHttpClientService } from './data-model-node-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelNodeService {
  private httpClient = inject(DataModelNodeHttpClientService);

  createNode(modelId: number, node: DataModelNodeSummary): Observable<DataModelNode> {
    return this.httpClient.createNode(modelId, node);
  }

  updateNode(modelId: number, node: DataModelNode): Observable<DataModelModificationDto> {
    return this.httpClient.updateNode(modelId, node);
  }

  deleteNode(modelId: number, nodeId: number): Observable<DataModelModificationDto> {
    return this.httpClient.deleteNode(modelId, nodeId);
  }

  reorderNodeFields(modelId: number, nodeId: number, request: DataModelFieldReorderRequest): Observable<DataModelModificationDto> {
    return this.httpClient.reorderNodeFields(modelId, nodeId, request);
  }
}
