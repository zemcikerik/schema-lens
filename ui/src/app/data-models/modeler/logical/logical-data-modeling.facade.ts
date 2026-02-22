import { computed, inject, Injectable } from '@angular/core';
import { DataModelingFacade } from '../data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { catchError, defer, filter, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { SchemaDiagramPositionSnapshot } from '../../../diagrams/schema/model/schema-diagram-position-snapshot.model';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { LogicalModelStore } from './logical-model.store';
import { LogicalDiagramMapper } from './logical-diagram.mapper';
import { LogicalEntity, LogicalRelationship } from '../../models/logical-model.model';
import { LogicalModelDiagram } from '../../models/data-model-diagram.model';

@Injectable()
export class LogicalDataModelingFacade implements DataModelingFacade {
  private store = inject(LogicalModelStore);
  private state = inject(LogicalDataModelingState);
  private mapper = inject(LogicalDiagramMapper);
  private dialogs = inject(LogicalDataModelerDialogService);

  readonly patches$ = this.state.patches$.asObservable();
  readonly loading = this.state.loading.asReadonly();
  readonly diagramName = computed(() => this.store.activeDiagram()?.name ?? '');

  initDiagram(): void {
    const model = this.store.model();
    const diagram = this.store.activeDiagram();

    if (!model || !diagram) {
      console.log(this.store);
      throw new Error('Cannot initialize modeler without active model and diagram');
    }

    const entities = model.entities;
    const includedEntityIds = new Set(diagram.entities.map(e => e.entityId));
    const entitiesToRender = entities.filter(e => includedEntityIds.has(e.entityId!));

    for (const entity of entitiesToRender) {
      const position = this.entityPosition(entity.entityId!, diagram);
      this.state.patches$.next({ type: 'node:add', node: this.mapper.entityToNode(entity, model.dataTypes), position });
    }

    for (const rel of model.relationships) {
      if (!includedEntityIds.has(rel.fromEntityId) || !includedEntityIds.has(rel.toEntityId)) {
        continue;
      }

      const position = this.relationshipPosition(rel.relationshipId!, diagram);
      this.state.patches$.next({ type: 'edge:add', edge: this.mapper.relationshipToEdge(rel), position });
    }
  }

  connect(from: SchemaDiagramNode, to: SchemaDiagramNode): void {
    const relationship: LogicalRelationship = {
      relationshipId: 0,
      fromEntityId: from.id,
      toEntityId: to.id,
      type: '1:N',
      isMandatory: false,
      isIdentifying: false,
      attributes: [],
    };

    this.withLoading(
      this.store.createRelationship(relationship).pipe(
        tap(created => this.state.patches$.next({
          type: 'edge:add',
          edge: this.mapper.relationshipToEdge(created),
        })),
      ),
    ).subscribe();
  }

  // TODO: remove all related edges
  deleteNode(nodeId: number): void {
    this.dialogs.openDeleteEntityConfirmation().pipe(
      filter(result => !!result),
      switchMap(() =>
        this.withLoading(
          this.store.deleteEntity(nodeId).pipe(
            tap(() => this.state.patches$.next({ type: 'node:remove', nodeId })),
          ),
        ),
      ),
    ).subscribe();
  }

  deleteEdge(edgeId: number): void {
    this.dialogs.openDeleteRelationshipConfirmation().pipe(
      filter(result => !!result),
      switchMap(() =>
        this.withLoading(
          this.store.deleteRelationship(edgeId).pipe(
            tap(() => this.state.patches$.next({ type: 'edge:remove', edgeId })),
          ),
        ),
      ),
    ).subscribe();
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

    return this.withLoading(this.store.updateDiagram(updatedDiagram));
  }

  updateEntity(entity: LogicalEntity): void {
    this.withLoading(
      this.store.updateEntity(entity).pipe(
        tap(saved => this.notifyEntityUpdated(saved)),
      ),
    ).subscribe();
  }

  updateRelationship(rel: LogicalRelationship): void {
    this.withLoading(
      this.store.updateRelationship(rel).pipe(
        tap(saved => this.notifyRelationshipUpdated(saved)),
      ),
    ).subscribe();
  }

  updateDiagramName(name: string): void {
    const diagram = this.store.activeDiagram() as LogicalModelDiagram;
    this.withLoading(
      this.store.updateDiagram({ ...diagram, name }),
    ).subscribe();
  }

  private notifyEntityUpdated(entity: LogicalEntity): void {
    this.state.patches$.next({
      type: 'node:update',
      node: this.mapper.entityToNode(entity, this.store.dataTypes()),
    });
  }

  private notifyRelationshipUpdated(rel: LogicalRelationship): void {
    this.state.patches$.next({
      type: 'edge:update',
      edge: this.mapper.relationshipToEdge(rel),
    });
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
