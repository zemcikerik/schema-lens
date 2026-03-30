import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DataModelDiagram } from '../models/data-model-diagram.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramHttpClientService {
  private httpClient = inject(HttpClient);

  getDiagram(dataModelId: number, diagramId: number): Observable<DataModelDiagram> {
    return this.httpClient.get<DataModelDiagram>(`/model/${dataModelId}/diagram/${diagramId}`);
  }

  createDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.httpClient.post<DataModelDiagram>(`/model/${dataModelId}/diagram`, diagram);
  }

  updateDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.httpClient.put<DataModelDiagram>(`/model/${dataModelId}/diagram/${diagram.id}`, diagram);
  }

  deleteDiagram(dataModelId: number, diagramId: number): Observable<boolean> {
    return this.httpClient.delete<void>(`/model/${dataModelId}/diagram/${diagramId}`).pipe(
      map(() => true),
    );
  }
}
