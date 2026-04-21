import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, of, finalize, defer, map } from 'rxjs';
import { DataModelDetails, DataModelModification } from './models/data-model.model';
import { DataModelEdge } from './models/data-model-edge.model';
import { DataModelFieldReorderRequest, DataModelNode, DataModelNodeSummary } from './models/data-model-node.model';
import { DataModelDataType } from './models/data-model-data-type.model';
import { DataModelDiagram, LogicalModelDiagram } from './models/data-model-diagram.model';
import { DataModelDetailsService } from './services/data-model-details.service';
import { DataModelNodeService } from './services/data-model-node.service';
import { DataModelEdgeService } from './services/data-model-edge.service';
import { DataModelDataTypeService } from './services/data-model-data-type.service';
import { DataModelDiagramService } from './services/data-model-diagram.service';

@Injectable({ providedIn: 'root' })
export class DataModelStore {
  private dataModelDetailsService = inject(DataModelDetailsService);
  private nodeService = inject(DataModelNodeService);
  private edgeService = inject(DataModelEdgeService);
  private dataTypeService = inject(DataModelDataTypeService);
  private diagramService = inject(DataModelDiagramService);

  dataModelId = -1;

  private _model = signal<DataModelDetails | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<unknown>(null);
  private _activeDiagramId = signal<number | null>(null);
  private _loadedDiagramIds = new Set<number>();

  readonly model = this._model.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly nodes = computed(() => this._model()?.nodes ?? []);
  readonly edges = computed(() => this._model()?.edges ?? []);
  readonly dataTypes = computed(() => this._model()?.dataTypes ?? []);
  readonly diagrams = computed(() => this._model()?.diagrams ?? []);

  readonly activeDiagram = computed<LogicalModelDiagram | null>(
    () => (this.diagrams().find(d => d.id === this._activeDiagramId()) ?? null) as LogicalModelDiagram | null,
  );

  loadModel(dataModelId: number): Observable<DataModelDetails | null> {
    return defer(() => {
      if (this.dataModelId === dataModelId) {
        return of(this._model());
      }

      this._model.set(null);
      this._loading.set(true);
      this._error.set(null);
      this._activeDiagramId.set(null);
      this._loadedDiagramIds.clear();

      return this.dataModelDetailsService.getDataModelDetails(dataModelId).pipe(
        tap({
          next: model => {
            this.dataModelId = dataModelId;
            this._model.set(model);
          },
          error: err => this._error.set(err),
        }),
        finalize(() => this._loading.set(false)),
      );
    });
  }

  loadDiagram(diagramId: number): Observable<unknown> {
    return defer(() => {
      this._activeDiagramId.set(diagramId);

      if (this._loadedDiagramIds.has(diagramId)) {
        return of(null);
      }

      this._loading.set(true);
      this._error.set(null);

      return this.diagramService.getDiagram(this.dataModelId, diagramId).pipe(
        tap({
          next: diagram => {
            this._loadedDiagramIds.add(diagramId);
            this._model.update(m => m && {
              ...m,
              diagrams: m.diagrams.map(d => (d.id === diagram.id ? diagram : d)),
            });
          },
          error: err => this._error.set(err),
        }),
        finalize(() => this._loading.set(false)),
      );
    });
  }

  createNode(node: DataModelNodeSummary): Observable<DataModelModification> {
    return this.nodeService.createNode(this.dataModelId, node).pipe(
      map(created => ({ updatedNodes: [created], updatedEdges: [], deletedNodeIds: [], deletedEdgeIds: [] })),
      tap(modification => this.mergeModification(modification)),
    );
  }

  updateNode(node: DataModelNode): Observable<DataModelModification> {
    return this.nodeService.updateNode(this.dataModelId, node).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  deleteNode(nodeId: number): Observable<DataModelModification> {
    return this.nodeService.deleteNode(this.dataModelId, nodeId).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  createEdge(edge: DataModelEdge): Observable<DataModelModification> {
    return this.edgeService.createEdge(this.dataModelId, edge).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  updateEdge(edge: DataModelEdge): Observable<DataModelModification> {
    return this.edgeService.updateEdge(this.dataModelId, edge).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  deleteEdge(edgeId: number): Observable<DataModelModification> {
    return this.edgeService.deleteEdge(this.dataModelId, edgeId).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  createDataType(dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.dataTypeService
      .createDataType(this.dataModelId, dataType)
      .pipe(tap(created => this._model.update(m => m && { ...m, dataTypes: [...m.dataTypes, created] })));
  }

  updateDataType(dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.dataTypeService.updateDataType(this.dataModelId, dataType).pipe(
      tap(updated =>
        this._model.update(m => m && {
          ...m,
          dataTypes: m.dataTypes.map(t => (t.typeId === updated.typeId ? updated : t)),
        }),
      ),
    );
  }

  deleteDataType(typeId: number): Observable<unknown> {
    return this.dataTypeService.deleteDataType(this.dataModelId, typeId).pipe(tap(success => {
      if (success) {
        this._model.update(m => m && {
          ...m,
          dataTypes: m.dataTypes.filter(t => t.typeId !== typeId),
        });
      }
    }));
  }

  createDiagram(diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramService
      .createDiagram(this.dataModelId, diagram)
      .pipe(tap(created => this._model.update(m => m && { ...m, diagrams: [...m.diagrams, created] })));
  }

  updateDiagram(diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramService.updateDiagram(this.dataModelId, diagram).pipe(
      tap(updated =>
        this._model.update(m => m && {
          ...m,
          diagrams: m.diagrams.map(d => (d.id === updated.id ? updated : d)),
        }),
      ),
    );
  }

  deleteDiagram(diagramId: number): Observable<boolean> {
    return this.diagramService.deleteDiagram(this.dataModelId, diagramId).pipe(
      tap(() =>
        this._model.update(m => m && {
          ...m,
          diagrams: m.diagrams.filter(d => d.id !== diagramId),
        }),
      ),
    );
  }

  reorderFields(nodeId: number, request: DataModelFieldReorderRequest): Observable<DataModelModification> {
    return this.nodeService.reorderNodeFields(this.dataModelId, nodeId, request).pipe(
      tap(modification => this.mergeModification(modification)),
    );
  }

  private mergeModification(modification: DataModelModification): void {
    this._model.update(model => model ? this.applyModification(model, modification) : model);
  }

  private applyModification(model: DataModelDetails, modification: DataModelModification): DataModelDetails {
    const deletedNodeIds = new Set(modification.deletedNodeIds);
    const deletedEdgeIds = new Set(modification.deletedEdgeIds);

    const updatedNodesById = new Map(modification.updatedNodes.map(node => [node.nodeId, node]));
    const updatedEdgesById = new Map(modification.updatedEdges.map(edge => [edge.edgeId, edge]));

    const mergedNodes = model.nodes
      .filter(node => !deletedNodeIds.has(node.nodeId as number))
      .map(node => updatedNodesById.get(node.nodeId) ?? node);

    for (const node of modification.updatedNodes) {
      if (!deletedNodeIds.has(node.nodeId as number) && !mergedNodes.some(existing => existing.nodeId === node.nodeId)) {
        mergedNodes.push(node);
      }
    }

    const mergedEdges = model.edges
      .filter(edge => !deletedEdgeIds.has(edge.edgeId as number))
      .map(edge => updatedEdgesById.get(edge.edgeId) ?? edge);

    for (const edge of modification.updatedEdges) {
      if (!deletedEdgeIds.has(edge.edgeId as number) && !mergedEdges.some(existing => existing.edgeId === edge.edgeId)) {
        mergedEdges.push(edge);
      }
    }

    return { ...model, nodes: mergedNodes, edges: mergedEdges };
  }
}
