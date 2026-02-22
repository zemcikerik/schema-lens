import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { DataModelDiagram } from '../models/data-model-diagram.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramHttpClientService {
  private httpClient = inject(HttpClient);

  getDiagram(dataModelId: number, diagramId: number): Observable<DataModelDiagram> {
    //return this.httpClient.get<DataModelDiagram>(`/model/${dataModelId}/diagram/${diagramId}`);
    return of({
      id: diagramId,
      name: diagramId === 100 ? 'diagram 1' : 'diagram 2',
      type: 'logical' as const,
      entities: [
        { entityId: 11, x: 100, y: 150, width: 200, height: 120 },
      ],
      relationships: [
        {
          relationshipId: 21342134,
          points: [
            { x: 300, y: 210 },
            { x: 450, y: 210 },
          ],
        },
      ],
    }).pipe(delay(500));
  }

  createDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return of({
      id: 0,
      name: diagram.name,
      type: 'logical' as const,
      entities: [],
      relationships: [],
    }).pipe(delay(1500));
  }

  updateDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return of({
      id: diagram.id,
      name: diagram.name,
      type: 'logical' as const,
      entities: diagram.entities,
      relationships: diagram.relationships,
    }).pipe(delay(1500));
  }

  deleteDiagram(dataModelId: number, diagramId: number): Observable<boolean> {
    //return this.httpClient.delete(`/model/${dataModelId}/diagram/${diagramId}`);
    return of(true).pipe(delay(1500));
  }
}
