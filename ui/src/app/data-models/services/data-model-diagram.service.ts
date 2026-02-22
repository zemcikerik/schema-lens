import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelDiagram } from '../models/data-model-diagram.model';
import { DataModelDiagramHttpClientService } from './data-model-diagram-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramService {
  private diagramHttpClient = inject(DataModelDiagramHttpClientService);

  getDiagram(dataModelId: number, diagramId: number): Observable<DataModelDiagram> {
    return this.diagramHttpClient.getDiagram(dataModelId, diagramId);
  }

  createDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramHttpClient.createDiagram(dataModelId, diagram);
  }

  updateDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramHttpClient.updateDiagram(dataModelId, diagram);
  }

  deleteDiagram(dataModelId: number, diagramId: number): Observable<boolean> {
    return this.diagramHttpClient.deleteDiagram(dataModelId, diagramId);
  }
}
