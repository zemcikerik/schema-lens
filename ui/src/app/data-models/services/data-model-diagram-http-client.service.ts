import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Diagram } from '../models/diagram';

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramHttpClientService {
  private httpClient = inject(HttpClient);

  createDiagram(dataModelId: number, diagram: Diagram): Observable<Diagram> {
    return of({
      id: 0,
      name: diagram.name,
      type: 'Logical',
      entities: [],
      relationships: [],
    }).pipe(delay(1500));
  }

  updateDiagram(dataModelId: number, diagram: Diagram): Observable<Diagram> {
    return of({
      id: diagram.id,
      name: diagram.name,
      type: 'Logical',
      entities: diagram.entities,
      relationships: diagram.relationships,
    }).pipe(delay(1500));
  }

  deleteDiagram(dataModelId: number, diagram: Diagram): Observable<boolean> {
    return of(true).pipe(delay(1500));
  }
}
