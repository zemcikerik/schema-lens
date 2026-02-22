import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';
import { LogicalDataModel } from '../models/logical-model.model';
import { DataModelDiagramHttpClientService } from './data-model-diagram-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataModelHttpClientService {
  private httpClient = inject(HttpClient);
  private diagramHttpClient = inject(DataModelDiagramHttpClientService);

  getLogicalDataModel(dataModelId: number): Observable<LogicalDataModel | null> {
    return this.httpClient.get<Omit<LogicalDataModel, 'diagrams'>>(`/model/${dataModelId}/logical`).pipe(
      map(response => {
        const diagrams = this.diagramHttpClient.seedDataModel(dataModelId, []);
        return { ...response, diagrams };
      }),
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }
}
