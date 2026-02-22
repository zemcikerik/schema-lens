import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { DataModelDiagram } from '../models/data-model-diagram.model';

// THIS IS A MOCK GENERATED USING AI, it should not be used in production setting
// TODO: replace me when BE implementation is done

let nextDiagramId = 1000;

@Injectable({
  providedIn: 'root',
})
export class DataModelDiagramHttpClientService {
  private readonly store = new Map<number, Map<number, DataModelDiagram>>();

  seedDataModel(dataModelId: number, diagrams: DataModelDiagram[]): DataModelDiagram[] {
    if (!this.store.has(dataModelId)) {
      const map = new Map<number, DataModelDiagram>();
      for (const d of diagrams) {
        map.set(d.id as number, d);
      }
      this.store.set(dataModelId, map);
    }
    return [...this.store.get(dataModelId)!.values()];
  }

  getDiagramSummaries(dataModelId: number): DataModelDiagram[] {
    return [...(this.store.get(dataModelId)?.values() ?? [])];
  }

  getDiagram(dataModelId: number, diagramId: number): Observable<DataModelDiagram> {
    const diagram = this.store.get(dataModelId)?.get(diagramId);
    if (!diagram) {
      return throwError(() => new Error(`Diagram ${diagramId} not found in data model ${dataModelId}`));
    }
    return of({ ...diagram }).pipe(delay(300));
  }

  createDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    const id = nextDiagramId++;
    const created: DataModelDiagram = {
      ...diagram,
      id,
      entities: [],
      relationships: [],
    };
    this.modelMap(dataModelId).set(id, created);
    return of({ ...created }).pipe(delay(500));
  }

  updateDiagram(dataModelId: number, diagram: DataModelDiagram): Observable<DataModelDiagram> {
    const map = this.store.get(dataModelId);
    if (!map || !map.has(diagram.id as number)) {
      return throwError(() => new Error(`Diagram ${diagram.id} not found in data model ${dataModelId}`));
    }
    const updated: DataModelDiagram = { ...diagram };
    map.set(diagram.id as number, updated);
    return of({ ...updated }).pipe(delay(500));
  }

  deleteDiagram(dataModelId: number, diagramId: number): Observable<boolean> {
    this.store.get(dataModelId)?.delete(diagramId);
    return of(true).pipe(delay(500));
  }

  private modelMap(dataModelId: number): Map<number, DataModelDiagram> {
    if (!this.store.has(dataModelId)) {
      this.store.set(dataModelId, new Map());
    }
    return this.store.get(dataModelId)!;
  }
}
