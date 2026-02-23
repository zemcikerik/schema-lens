import { computed, inject, Injectable } from '@angular/core';
import { DataModelingFacade } from '../data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { catchError, defer, filter, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { SchemaDiagramPositionSnapshot } from '../../../diagrams/schema/model/schema-diagram-position-snapshot.model';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { LogicalModelStore } from '../../logical-model.store';
import { LogicalDiagramMapper } from './logical-diagram.mapper';
import { LogicalDataModel, LogicalAttribute, LogicalEntity, LogicalEntitySummary, LogicalRelationship } from '../../models/logical-model.model';
import { LogicalModelDiagram } from '../../models/data-model-diagram.model';
import { LogicalEntityAttributeResolverService } from '../../services/logical-entity-attribute-resolver.service';
import { LogicalAttributeEditorService } from '../../services/logical-attribute-editor.service';
import { LogicalRelationshipEditorService } from '../../services/logical-relationship-editor.service';
import { ResolvedAttribute } from '../../models/resolved-attribute.model';

@Injectable()
export class LogicalDataModelingFacade implements DataModelingFacade {
  private store = inject(LogicalModelStore);
  private state = inject(LogicalDataModelingState);
  private mapper = inject(LogicalDiagramMapper);
  private dialogs = inject(LogicalDataModelerDialogService);
  private attributeResolver = inject(LogicalEntityAttributeResolverService);
  private attributeEditor = inject(LogicalAttributeEditorService);
  private relationshipEditor = inject(LogicalRelationshipEditorService);

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

    const entities = model.entities;
    const includedEntityIds = new Set(diagram.entities.map(e => e.entityId));
    const entitiesToRender = entities.filter(e => includedEntityIds.has(e.entityId!));

    for (const entity of entitiesToRender) {
      const position = this.entityPosition(entity.entityId!, diagram);
      this.state.patches$.next({ type: 'node:add', node: this.resolveAndMapEntity(entity), position });
    }

    for (const rel of model.relationships) {
      if (!includedEntityIds.has(rel.fromEntityId) || !includedEntityIds.has(rel.toEntityId)) {
        continue;
      }

      const position = this.relationshipPosition(rel.relationshipId!, diagram);
      this.state.patches$.next({ type: 'edge:add', edge: this.mapper.relationshipToEdge(rel), position });
    }
  }

  addExistingNode(): void {
    const model = this.store.model() as LogicalDataModel;
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;

    const includedEntityIds = new Set(diagram.entities.map(e => e.entityId));
    const availableEntities = model.entities.filter(e => e.entityId !== null && !includedEntityIds.has(e.entityId) && !this.pendingEntityIds.has(e.entityId!));

    this.dialogs
      .openAddExistingEntity(availableEntities)
      .pipe(filter(entity => entity !== null))
      .subscribe(entity => {
        const newEntityId = entity.entityId!;
        this.pendingEntityIds.add(newEntityId);
        this.state.patches$.next({
          type: 'node:add',
          node: this.resolveAndMapEntity(entity),
        });

        this.emitNewlyVisibleRelationships(newEntityId, includedEntityIds);
      });
  }

  createNode(): void {
    const model = this.store.model() as LogicalDataModel;

    this.dialogs
      .openCreateEntity(model.entities)
      .pipe(filter(entity => entity !== null))
      .subscribe(entity => {
        this.pendingEntityIds.add(entity.entityId!);
        this.state.patches$.next({
          type: 'node:add',
          node: this.resolveAndMapEntity(entity),
        });
      });
  }

  connect(from: SchemaDiagramNode, to: SchemaDiagramNode): void {
    const fromEntityPkAttributes = this.attributeResolver.resolveAttributes(from.id)().flatMap((resolved, index) => {
      if (resolved.source === 'direct' && resolved.attribute.isPrimaryKey) {
        return [{ referencedAttributeId: resolved.attribute.attributeId as number, name: resolved.attribute.name, position: index }];
      }
      if (resolved.source === 'relationship' && resolved.relationship.isIdentifying) {
        return [{ referencedAttributeId: resolved.attribute.referencedAttributeId, name: resolved.attribute.name, position: index }];
      }
      return [];
    });

    const relationship: LogicalRelationship = {
      relationshipId: 0,
      fromEntityId: from.id,
      toEntityId: to.id,
      type: '1:N',
      isMandatory: false,
      isIdentifying: false,
      attributes: fromEntityPkAttributes,
    };

    this.withLoading(
      this.store.createRelationship(relationship).pipe(
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
      entities: Object.entries(snapshot.nodes).map(([id, pos]) => ({
        entityId: Number(id),
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
      })),
      relationships: Object.entries(snapshot.edges).map(([id, pos]) => ({
        relationshipId: Number(id),
        points: pos.points,
      })),
    };

    return this.withLoading(this.store.updateDiagram(updatedDiagram).pipe(
      tap(() => this.pendingEntityIds.clear()),
    ));
  }

  updateEntity(entity: LogicalEntitySummary): void {
    this.withLoading(
      this.store.updateEntity(entity).pipe(
        tap(saved => this.notifyEntityUpdated(saved)),
      ),
    ).subscribe();
  }

  updateRelationship(updated: LogicalRelationship): void {
    const previous = this.store.relationships().find(r => r.relationshipId === updated.relationshipId) as LogicalRelationship;

    this.withLoading(
      this.relationshipEditor.updateRelationship(previous, updated).pipe(
        tap(result => {
          this.notifyRelationshipUpdated(result.updatedRelationship);
          result.affectedEntityIds.forEach(entityId => this.notifyEntityUpdatedById(entityId));
        }),
      ),
    ).subscribe();
  }

  reorderAttributes(entityId: number, orderedAttributes: ResolvedAttribute[]): void {
    this.withLoading(
      this.attributeResolver
        .reorderAttributes(entityId, orderedAttributes)
        .pipe(tap(() => this.notifyEntityUpdatedById(entityId))),
    ).subscribe();
  }

  addAttribute(entityId: number): void {
    const resolved = this.attributeResolver.resolveAttributes(entityId)();
    const nextPosition = resolved.length > 0 ? Math.max(...resolved.map(r => r.position)) + 1 : 0;

    this.dialogs.openCreateAttribute(this.store.dataTypes()).pipe(
      filter(created => created !== null),
      switchMap(created => this.withLoading(
        this.attributeEditor.createAttribute(entityId, { ...created, position: nextPosition }).pipe(
          tap(result => this.notifyAttributeChangeResult(entityId, result.affectedRelationships)),
        ),
      )),
    ).subscribe();
  }

  // TODO: data type changed cascade
  editAttribute(entityId: number, attribute: LogicalAttribute): void {
    this.dialogs.openEditAttribute(attribute, this.store.dataTypes()).pipe(
      filter(updated => updated !== null),
      switchMap(updated => this.withLoading(
        this.attributeEditor.editAttribute(entityId, attribute, updated).pipe(
          tap(result => this.notifyAttributeChangeResult(entityId, result.affectedRelationships)),
        ),
      )),
    ).subscribe();
  }

  deleteAttribute(entityId: number, attribute: LogicalAttribute): void {
    this.dialogs.openDeleteAttributeConfirmation().pipe(
      filter(result => !!result),
      switchMap(() => this.withLoading(
        this.store.deleteAttribute(entityId, attribute.attributeId as number).pipe(
          tap(result => this.notifyAttributeChangeResult(entityId, result.affectedRelationships)),
        ),
      )),
    ).subscribe();
  }

  private notifyAttributeChangeResult(ownerEntityId: number, affectedRelationships: LogicalRelationship[]): void {
    this.notifyEntityUpdatedById(ownerEntityId);
    const notifiedEntityIds = new Set<number>([ownerEntityId]);

    for (const rel of affectedRelationships) {
      this.notifyRelationshipUpdated(rel);

      if (!notifiedEntityIds.has(rel.toEntityId)) {
        this.notifyEntityUpdatedById(rel.toEntityId);
        notifiedEntityIds.add(rel.toEntityId);
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

  private notifyEntityUpdated(entity: LogicalEntity): void {
    this.state.patches$.next({
      type: 'node:update',
      node: this.resolveAndMapEntity(entity),
    });
  }

  private notifyEntityUpdatedById(entityId: number): void {
    this.notifyEntityUpdated(this.store.entities().find(e => e.entityId === entityId) as LogicalEntity);
  }

  private resolveAndMapEntity(entity: LogicalEntity): SchemaDiagramNode {
    const resolvedAttributes = this.attributeResolver.resolveAttributes(entity.entityId!)();

    const attributeTypeById = new Map<number, number>(
      this.store.entities().flatMap(e =>
        e.attributes.map(a => [a.attributeId as number, a.typeId]),
      ),
    );

    const attributes: LogicalAttribute[] = resolvedAttributes.map(r => {
      if (r.source === 'direct') {
        return r.attribute;
      }

      return {
        attributeId: null,
        name: r.attribute.name,
        typeId: attributeTypeById.get(r.attribute.referencedAttributeId) ?? 0,
        isPrimaryKey: r.relationship.isIdentifying,
        isNullable: !r.relationship.isMandatory,
        position: r.position,
      };
    });

    const parentRelationships = this.store.relationships().filter(rel => rel.toEntityId === entity.entityId);
    return this.mapper.entityToNode({ ...entity, attributes }, this.store.dataTypes(), parentRelationships);
  }

  private notifyRelationshipUpdated(rel: LogicalRelationship): void {
    this.state.patches$.next({
      type: 'edge:update',
      edge: this.mapper.relationshipToEdge(rel),
    });
  }

  private emitNewlyVisibleRelationships(newEntityId: number, previouslyIncludedEntityIds: Set<number>): void {
    const model = this.store.model() as LogicalDataModel;
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;

    const visibleEntityIds = new Set([...previouslyIncludedEntityIds, ...this.pendingEntityIds]);
    const newRelationships = model.relationships.filter(rel => {
      const connectsNewEntity = rel.fromEntityId === newEntityId || rel.toEntityId === newEntityId;
      const bothSidesVisible = visibleEntityIds.has(rel.fromEntityId) && visibleEntityIds.has(rel.toEntityId);
      const alreadyInDiagram = diagram.relationships.some(r => r.relationshipId === rel.relationshipId);
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
    const model = this.store.model() as LogicalDataModel;
    const relatedEdges = model.relationships.filter(
      rel => rel.fromEntityId === nodeId || rel.toEntityId === nodeId,
    );
    for (const rel of relatedEdges) {
      this.state.patches$.next({ type: 'edge:remove', edgeId: rel.relationshipId! });
    }
  }

  private entityPosition(entityId: number, diagram: LogicalModelDiagram) {
    const pos = diagram.entities.find(e => e.entityId === entityId);
    return pos ? { x: pos.x, y: pos.y, width: pos.width, height: pos.height } : undefined;
  }

  private relationshipPosition(relationshipId: number, diagram: LogicalModelDiagram) {
    const pos = diagram.relationships.find(r => r.relationshipId === relationshipId);
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
