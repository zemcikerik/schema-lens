import { computed, inject, Injectable } from '@angular/core';
import { DataModelingFacade } from '../data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { catchError, defer, filter, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { SchemaDiagramPositionSnapshot } from '../../../diagrams/schema/model/schema-diagram-position-snapshot.model';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { DataModelStore } from '../../data-model.store';
import { LogicalDiagramMapper } from './logical-diagram.mapper';
import { DataModelDetails, DataModelEdge, DataModelField, DataModelNode, DataModelNodeSummary } from '../../models/data-model-types.model';
import { LogicalModelDiagram } from '../../models/data-model-diagram.model';
import { DataModelNodeFieldResolverService } from '../../services/data-model-node-field-resolver.service';
import { ResolvedField } from '../../models/resolved-field.model';

@Injectable()
export class LogicalDataModelingFacade implements DataModelingFacade {
  private store = inject(DataModelStore);
  private state = inject(LogicalDataModelingState);
  private mapper = inject(LogicalDiagramMapper);
  private dialogs = inject(LogicalDataModelerDialogService);
  private fieldResolver = inject(DataModelNodeFieldResolverService);

  private pendingEntityIds = new Set<number>();

  patches$ = this.state.patches$.asObservable();
  loading = this.state.loading.asReadonly();
  diagramName = computed(() => this.store.activeDiagram()?.name ?? '');

  initDiagram(): void {
    const model = this.store.model();
    const diagram = this.store.activeDiagram();

    if (!model || !diagram) {
      throw new Error('Cannot initialize modeler without active model and diagram');
    }

    this.state.patches$.next({ type: 'diagram:clear' });
    this.pendingEntityIds.clear();

    const entities = model.nodes;
    const includedEntityIds = new Set((diagram.nodes ?? []).map(e => e.nodeId));
    const entitiesToRender = entities.filter(e => includedEntityIds.has(e.nodeId!));

    for (const entity of entitiesToRender) {
      const position = this.entityPosition(entity.nodeId!, diagram);
      this.state.patches$.next({ type: 'node:add', node: this.resolveAndMapEntity(entity), position });
    }

    for (const rel of model.edges) {
      if (!includedEntityIds.has(rel.fromNodeId) || !includedEntityIds.has(rel.toNodeId)) {
        continue;
      }

      const position = this.relationshipPosition(rel.edgeId!, diagram);
      this.state.patches$.next({ type: 'edge:add', edge: this.mapper.relationshipToEdge(rel), position });
    }
  }

  addExistingNode(): void {
    const model = this.store.model() as DataModelDetails;
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;

    const includedEntityIds = new Set((diagram.nodes ?? []).map(e => e.nodeId));
    const availableEntities = model.nodes.filter(e => e.nodeId !== null && !includedEntityIds.has(e.nodeId) && !this.pendingEntityIds.has(e.nodeId!));

    this.dialogs
      .openAddExistingEntity(availableEntities)
      .pipe(filter(entity => entity !== null))
      .subscribe(entity => {
        const newEntityId = entity.nodeId!;
        this.pendingEntityIds.add(newEntityId);
        this.state.patches$.next({
          type: 'node:add',
          node: this.resolveAndMapEntity(entity),
        });

        this.emitNewlyVisibleRelationships(newEntityId, includedEntityIds);
      });
  }

  createNode(): void {
    const model = this.store.model() as DataModelDetails;

    this.dialogs
      .openCreateEntity(model.nodes)
      .pipe(filter(entity => entity !== null))
      .subscribe(entity => {
        this.pendingEntityIds.add(entity.nodeId!);
        this.state.patches$.next({
          type: 'node:add',
          node: this.resolveAndMapEntity(entity),
        });
      });
  }

  connect(from: SchemaDiagramNode, to: SchemaDiagramNode): void {
    const fromEntityPkAttributes = this.fieldResolver.resolveFields(from.id)().flatMap((resolved, index) => {
      if (resolved.source === 'direct' && resolved.field.isPrimaryKey) {
        return [{ referencedFieldId: resolved.field.fieldId as number, name: resolved.field.name, position: index }];
      }
      if (resolved.source === 'edge' && resolved.edge.isIdentifying) {
        return [{ referencedFieldId: resolved.field.referencedFieldId, name: resolved.field.name, position: index }];
      }
      return [];
    });

    const relationship: DataModelEdge = {
      edgeId: 0,
      modelId: this.store.dataModelId,
      fromNodeId: from.id,
      toNodeId: to.id,
      type: '1:N',
      isMandatory: false,
      isIdentifying: false,
      fields: fromEntityPkAttributes,
    };

    this.withLoading(
      this.store.createEdge(relationship).pipe(
        tap(created => {
          this.state.patches$.next({
            type: 'edge:add',
            edge: this.mapper.relationshipToEdge(created),
          });

          if (fromEntityPkAttributes.length > 0) {
            this.notifyEntityUpdatedById(to.id);
          }
        }),
      ),
    ).subscribe();
  }

  deleteNode(nodeId: number): void {
    this.dialogs.openDeleteEntityConfirmation().pipe(
      filter(result => !!result),
    ).subscribe(() => {
      this.removeNodeEdges(nodeId);
      this.pendingEntityIds.delete(nodeId);
      this.state.patches$.next({ type: 'node:remove', nodeId });
    });
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

    return this.withLoading(this.store.updateDiagram(updatedDiagram).pipe(
      tap(() => this.pendingEntityIds.clear()),
    ));
  }

  updateEntity(entity: DataModelNodeSummary): void {
    this.withLoading(
      this.store.updateNode(entity).pipe(
        tap(saved => this.notifyEntityUpdated(saved)),
      ),
    ).subscribe();
  }

  updateRelationship(updated: DataModelEdge): void {
    this.withLoading(
      this.store.updateEdge(updated).pipe(
        tap(savedRelationship => {
          this.notifyRelationshipUpdated(savedRelationship);
          this.notifyEntityUpdatedById(savedRelationship.fromNodeId);
          this.notifyEntityUpdatedById(savedRelationship.toNodeId);
        }),
      ),
    ).subscribe();
  }

  reorderAttributes(entityId: number, orderedAttributes: ResolvedField[]): void {
    this.withLoading(
      this.fieldResolver
        .reorderFields(entityId, orderedAttributes)
        .pipe(tap(() => this.notifyEntityUpdatedById(entityId))),
    ).subscribe();
  }

  addAttribute(entityId: number): void {
    const resolved = this.fieldResolver.resolveFields(entityId)();
    const nextPosition = resolved.length > 0 ? Math.max(...resolved.map(r => r.position)) + 1 : 0;

    this.dialogs.openCreateAttribute(this.store.dataTypes()).pipe(
      filter(created => created !== null),
      switchMap(created => this.withLoading(
        this.store.createField(entityId, { ...created, position: nextPosition }).pipe(
          tap(() => {
            this.notifyEntityUpdatedById(entityId);
            this.notifyRelationshipsTargetingEntity(entityId);
          }),
        ),
      )),
    ).subscribe();
  }

  // TODO: data type changed cascade
  editAttribute(entityId: number, attribute: DataModelField): void {
    this.dialogs.openEditAttribute(attribute, this.store.dataTypes()).pipe(
      filter(updated => updated !== null),
      switchMap(updated => this.withLoading(
        this.store.updateField(entityId, updated).pipe(
          tap(() => {
            this.notifyEntityUpdatedById(entityId);
            this.notifyRelationshipsTargetingEntity(entityId);
          }),
        ),
      )),
    ).subscribe();
  }

  deleteAttribute(entityId: number, attribute: DataModelField): void {
    this.dialogs.openDeleteAttributeConfirmation().pipe(
      filter(result => !!result),
      switchMap(() => this.withLoading(
        this.store.deleteField(entityId, attribute.fieldId as number).pipe(
          tap(result => this.notifyAttributeChangeResult(entityId, result.affectedEdges)),
        ),
      )),
    ).subscribe();
  }

  private notifyAttributeChangeResult(ownerEntityId: number, affectedRelationships: DataModelEdge[]): void {
    this.notifyEntityUpdatedById(ownerEntityId);
    const notifiedEntityIds = new Set<number>([ownerEntityId]);

    for (const rel of affectedRelationships) {
      this.notifyRelationshipUpdated(rel);

      if (!notifiedEntityIds.has(rel.toNodeId)) {
        this.notifyEntityUpdatedById(rel.toNodeId);
        notifiedEntityIds.add(rel.toNodeId);
      }
    }
  }

  updateDiagramName(name: string): void {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;
    this.withLoading(
      this.store.updateDiagram({ ...diagram, name }),
    ).subscribe();
  }

  deleteDiagram(): Observable<boolean> {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;
    return this.dialogs.openDeleteDiagramConfirmation().pipe(
      filter(result => !!result),
      switchMap(() => this.withLoading(this.store.deleteDiagram(diagram.id as number))),
    );
  }

  private notifyEntityUpdated(entity: DataModelNode): void {
    this.state.patches$.next({
      type: 'node:update',
      node: this.resolveAndMapEntity(entity),
    });
  }

  private notifyEntityUpdatedById(entityId: number): void {
    this.notifyEntityUpdated(this.store.nodes().find(e => e.nodeId === entityId) as DataModelNode);
  }

  private resolveAndMapEntity(entity: DataModelNode): SchemaDiagramNode {
    const resolvedAttributes = this.fieldResolver.resolveFields(entity.nodeId!)();

    const attributeTypeById = new Map<number, number>(
      this.store.nodes().flatMap(e =>
        e.fields.map(a => [a.fieldId as number, a.typeId]),
      ),
    );

    const fields: DataModelField[] = resolvedAttributes.map(r => {
      if (r.source === 'direct') {
        return r.field;
      }

      return {
        fieldId: null,
        name: r.field.name,
        typeId: attributeTypeById.get(r.field.referencedFieldId) ?? 0,
        isPrimaryKey: r.edge.isIdentifying,
        isNullable: !r.edge.isMandatory,
        position: r.position,
      };
    });

    const parentEdges = this.store.edges().filter(edge => edge.toNodeId === entity.nodeId);
    return this.mapper.entityToNode({ ...entity, fields }, this.store.dataTypes(), parentEdges);
  }

  private notifyRelationshipUpdated(rel: DataModelEdge): void {
    this.state.patches$.next({
      type: 'edge:update',
      edge: this.mapper.relationshipToEdge(rel),
    });
  }

  private notifyRelationshipsTargetingEntity(entityId: number): void {
    this.store.edges().filter(edge => edge.fromNodeId === entityId).forEach(edge => {
      this.notifyRelationshipUpdated(edge);
      this.notifyEntityUpdatedById(edge.toNodeId);
    });
  }

  private emitNewlyVisibleRelationships(newEntityId: number, previouslyIncludedEntityIds: Set<number>): void {
    const model = this.store.model() as DataModelDetails;
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;

    const visibleEntityIds = new Set([...previouslyIncludedEntityIds, ...this.pendingEntityIds]);
    const newRelationships = model.edges.filter(rel => {
      const connectsNewEntity = rel.fromNodeId === newEntityId || rel.toNodeId === newEntityId;
      const bothSidesVisible = visibleEntityIds.has(rel.fromNodeId) && visibleEntityIds.has(rel.toNodeId);
      const alreadyInDiagram = (diagram.edges ?? []).some(r => r.edgeId === rel.edgeId);
      return connectsNewEntity && bothSidesVisible && !alreadyInDiagram;
    });

    for (const rel of newRelationships) {
      this.state.patches$.next({
        type: 'edge:add',
        edge: this.mapper.relationshipToEdge(rel),
      });
    }
  }

  private removeNodeEdges(nodeId: number): void {
    const model = this.store.model() as DataModelDetails;
    const relatedEdges = model.edges.filter(
      rel => rel.fromNodeId === nodeId || rel.toNodeId === nodeId,
    );
    for (const rel of relatedEdges) {
      this.state.patches$.next({ type: 'edge:remove', edgeId: rel.edgeId! });
    }
  }

  private entityPosition(entityId: number, diagram: LogicalModelDiagram) {
    const pos = (diagram.nodes ?? []).find(e => e.nodeId === entityId);
    return pos ? { x: pos.x, y: pos.y, width: pos.width, height: pos.height } : undefined;
  }

  private relationshipPosition(relationshipId: number, diagram: LogicalModelDiagram) {
    const pos = (diagram.edges ?? []).find(r => r.edgeId === relationshipId);
    return pos ? { points: [...pos.points] } : undefined;
  }

  private withLoading<T>(observable: Observable<T>): Observable<T> {
    return defer(() => {
      this.state.loading.set(true);
      return observable.pipe(
        catchError(err => {
          this.displayErrorDialog(err);
          return throwError(() => err);
        }),
        finalize(() => this.state.loading.set(false)),
      );
    });
  }

  private displayErrorDialog(err: unknown): void {
    console.error(err);
  }
}
