import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataModelDiagram } from '../models/data-model-diagram.model';
import { DataModelDiagramHttpClientService } from './data-model-diagram-http-client.service';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramService {
  private diagramHttpClient = inject(DataModelDiagramHttpClientService);

  getDiagram(dataModelId: number, diagramId: number): Observable<DataModelDiagram | null> {
    return this.diagramHttpClient.getDiagram(dataModelId, diagramId).pipe(
      catchSpecificHttpStatusError(404, () => of(null)),
    );
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
