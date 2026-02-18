import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Diagram } from '../models/diagram';
import { DataModelDiagramHttpClientService } from './data-model-diagram-http-client.service';

export enum ChangedReason {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface DiagramChangedArgs {
  reason: ChangedReason;
  diagram: Diagram;
}

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramService {
  diagramChanged$ = new Subject<DiagramChangedArgs>();

  private diagramHttpClient = inject(DataModelDiagramHttpClientService);

  createDiagram(dataModelId: number, diagram: Diagram): Observable<Diagram> {
    return this.diagramHttpClient
      .createDiagram(dataModelId, diagram)
      .pipe(tap(t => this.diagramChanged$.next({ reason: ChangedReason.CREATE, diagram: t })));
  }

  updateDiagram(dataModelId: number, diagram: Diagram): Observable<Diagram> {
    return this.diagramHttpClient
      .updateDiagram(dataModelId, diagram)
      .pipe(tap(t => this.diagramChanged$.next({ reason: ChangedReason.UPDATE, diagram: t })));
  }

  deleteDiagram(dataModelId: number, diagram: Diagram): Observable<boolean> {
    return this.diagramHttpClient
      .deleteDiagram(dataModelId, diagram)
      .pipe(tap(() => this.diagramChanged$.next({ reason: ChangedReason.DELETE, diagram: diagram })));
  }
}
