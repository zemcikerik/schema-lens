import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, defer, finalize, Observable, tap, throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { DataModelStore } from '../data-model.store';
import { DataModelerDiagramMapper } from './data-modeler-diagram.mapper';
import { DataModelNodeFieldResolver } from '../services/data-model-node-field.resolver';
import { SchemaDiagramPatch } from '../../diagrams/schema/model/schema-diagram-patches.model';
import { SchemaDiagramNode } from '../../diagrams/schema/model/schema-diagram-node.model';
import { SchemaDiagramPositionSnapshot } from '../../diagrams/schema/model/schema-diagram-position-snapshot.model';
import { DataModelDetails, DataModelModification } from '../models/data-model.model';
import { DataModelNode, DataModelField } from '../models/data-model-node.model';
import { LogicalModelDiagram } from '../models/data-model-diagram.model';

@Injectable()
export class DataModelerDiagramState {
  private store = inject(DataModelStore);
  private mapper = inject(DataModelerDiagramMapper);
  private fieldResolver = inject(DataModelNodeFieldResolver);

  private _patches$ = new Subject<SchemaDiagramPatch>();
  private _loading = signal<boolean>(false);

  patches$ = this._patches$.asObservable();
  loading = this._loading.asReadonly();
  diagramName = computed(() => this.store.activeDiagram()?.name ?? '');

  private pendingNodeIds = new Set<number>();
  private visibleNodeIds = new Set<number>();
  private visibleEdgeIds = new Set<number>();

  initDiagram(): void {
    const model = this.store.model();
    const diagram = this.store.activeDiagram();

    if (!model || !diagram) {
      throw new Error('Cannot initialize modeler without active model and diagram');
    }

    this._patches$.next({ type: 'diagram:clear' });
    this.pendingNodeIds.clear();
    this.visibleNodeIds.clear();
    this.visibleEdgeIds.clear();

    const includedNodeIds = new Set((diagram.nodes ?? []).map(e => e.nodeId));
    const nodesToRender = model.nodes.filter(n => includedNodeIds.has(n.nodeId as number));

    for (const node of nodesToRender) {
      const position = this.nodePosition(node.nodeId as number, diagram);
      this._patches$.next({ type: 'node:add', node: this.resolveAndMapNode(node), position });
      this.visibleNodeIds.add(node.nodeId as number);
    }

    for (const edge of model.edges) {
      if (!this.visibleNodeIds.has(edge.fromNodeId) || !this.visibleNodeIds.has(edge.toNodeId)) {
        continue;
      }

      const position = this.edgePosition(edge.edgeId as number, diagram);
      this._patches$.next({ type: 'edge:add', edge: this.mapper.edgeToDiagramEdge(edge), position });
      this.visibleEdgeIds.add(edge.edgeId as number);
    }
  }

  applyModification(modification: DataModelModification): void {
    for (const nodeId of modification.deletedNodeIds) {
      if (!this.visibleNodeIds.has(nodeId)) {
        continue;
      }

      this.visibleNodeIds.delete(nodeId);
      this.pendingNodeIds.delete(nodeId);
      this._patches$.next({ type: 'node:remove', nodeId });
    }

    for (const edgeId of modification.deletedEdgeIds) {
      if (!this.visibleEdgeIds.has(edgeId)) {
        continue;
      }

      this.visibleEdgeIds.delete(edgeId);
      this._patches$.next({ type: 'edge:remove', edgeId });
    }

    for (const node of modification.updatedNodes) {
      if (node.nodeId && this.visibleNodeIds.has(node.nodeId)) {
        this._patches$.next({ type: 'node:update', node: this.resolveAndMapNode(node) });
      }
    }

    for (const edge of modification.updatedEdges) {
      if (!edge.edgeId) {
        continue;
      }

      if (this.visibleEdgeIds.has(edge.edgeId)) {
        this._patches$.next({ type: 'edge:update', edge: this.mapper.edgeToDiagramEdge(edge) });
      } else if (this.visibleNodeIds.has(edge.fromNodeId) && this.visibleNodeIds.has(edge.toNodeId)) {
        this.visibleEdgeIds.add(edge.edgeId);
        this._patches$.next({ type: 'edge:add', edge: this.mapper.edgeToDiagramEdge(edge) });
      }
    }
  }

  addNodeToDiagram(node: DataModelNode): void {
    const nodeId = node.nodeId as number;
    this.pendingNodeIds.add(nodeId);
    this.visibleNodeIds.add(nodeId);
    this._patches$.next({ type: 'node:add', node: this.resolveAndMapNode(node) });
    this.emitNewlyVisibleEdges(nodeId);
  }

  getAvailableNodes(): DataModelNode[] {
    const model = this.store.model() as DataModelDetails;
    return model.nodes.filter(
      n => n.nodeId !== null && !this.visibleNodeIds.has(n.nodeId) && !this.pendingNodeIds.has(n.nodeId),
    );
  }

  savePositions(snapshot: SchemaDiagramPositionSnapshot): Observable<unknown> {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;

    const updatedDiagram: LogicalModelDiagram = {
      ...diagram,
      nodes: Object.entries(snapshot.nodes).map(([id, pos]) => ({
        nodeId: Number(id),
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
      })),
      edges: Object.entries(snapshot.edges).map(([id, pos]) => ({
        edgeId: Number(id),
        points: pos.points,
      })),
    };

    return this.withLoading(this.store.updateDiagram(updatedDiagram).pipe(tap(() => this.pendingNodeIds.clear())));
  }

  updateDiagramName(name: string): Observable<unknown> {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;
    return this.withLoading(this.store.updateDiagram({ ...diagram, name }));
  }

  deleteDiagram(): Observable<boolean> {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;
    return this.withLoading(this.store.deleteDiagram(diagram.id as number));
  }

  withLoading<T>(observable: Observable<T>): Observable<T> {
    return defer(() => {
      this._loading.set(true);
      return observable.pipe(
        catchError(err => {
          console.error(err);
          return throwError(() => err);
        }),
        finalize(() => this._loading.set(false)),
      );
    });
  }

  private resolveAndMapNode(node: DataModelNode): SchemaDiagramNode {
    const resolved = this.fieldResolver.resolveFields(node.nodeId as number)();

    const fieldTypeById = new Map<number, number>(
      this.store.nodes().flatMap(n => n.fields.map(f => [f.fieldId as number, f.typeId])),
    );

    const fields: DataModelField[] = resolved.map(r => {
      if (r.source === 'direct') {
        return r.field;
      }

      return {
        fieldId: null,
        name: r.field.name,
        typeId: fieldTypeById.get(r.field.referencedFieldId) ?? 0,
        isPrimaryKey: r.edge.isIdentifying,
        isNullable: !r.edge.isMandatory,
        position: r.position,
      };
    });

    const parentEdges = this.store.edges().filter(edge => edge.toNodeId === node.nodeId);
    return this.mapper.nodeToDiagramNode({ ...node, fields }, this.store.dataTypes(), parentEdges);
  }

  private emitNewlyVisibleEdges(newNodeId: number): void {
    const model = this.store.model() as DataModelDetails;

    for (const edge of model.edges) {
      if (this.visibleEdgeIds.has(edge.edgeId as number)) {
        continue;
      }

      const connectsNew = edge.fromNodeId === newNodeId || edge.toNodeId === newNodeId;
      const bothVisible = this.visibleNodeIds.has(edge.fromNodeId) && this.visibleNodeIds.has(edge.toNodeId);

      if (connectsNew && bothVisible) {
        this.visibleEdgeIds.add(edge.edgeId as number);
        this._patches$.next({ type: 'edge:add', edge: this.mapper.edgeToDiagramEdge(edge) });
      }
    }
  }

  private nodePosition(nodeId: number, diagram: LogicalModelDiagram) {
    const pos = (diagram.nodes ?? []).find(n => n.nodeId === nodeId);
    return pos ? { x: pos.x, y: pos.y, width: pos.width, height: pos.height } : undefined;
  }

  private edgePosition(edgeId: number, diagram: LogicalModelDiagram) {
    const pos = (diagram.edges ?? []).find(e => e.edgeId === edgeId);
    return pos ? { points: [...pos.points] } : undefined;
  }
}
