import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, of, finalize, defer, map } from 'rxjs';
import { LogicalDataModel, LogicalDataType, LogicalEntity, LogicalEntitySummary, LogicalAttribute, LogicalRelationship } from './models/logical-model.model';
import { AttributeDeletionResult } from './models/attribute-deletion-result.model';
import { DataModelDiagram, LogicalModelDiagram } from './models/data-model-diagram.model';
import { LogicalDataModelService } from './services/logical-data-model.service';
import { LogicalEntityService } from './services/logical-entity.service';
import { LogicalRelationshipService } from './services/logical-relationship.service';
import { LogicalDataTypeService } from './services/logical-data-type.service';
import { DataModelDiagramService } from './services/data-model-diagram.service';
import { LogicalAttributeService } from './services/logical-attribute.service';

@Injectable()
export class LogicalModelStore {
  private logicalDataModelService = inject(LogicalDataModelService);
  private logicalEntityService = inject(LogicalEntityService);
  private logicalRelationshipService = inject(LogicalRelationshipService);
  private logicalDataTypeService = inject(LogicalDataTypeService);
  private logicalAttributeService = inject(LogicalAttributeService);
  private diagramService = inject(DataModelDiagramService);

  dataModelId = -1; // this is initialized first by load()

  private readonly _model = signal<LogicalDataModel | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<unknown>(null);
  private readonly _activeDiagramId = signal<number | null>(null);
  private readonly _loadedDiagramIds = new Set<number>();

  readonly model = this._model.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly entities = computed(() => this._model()?.entities ?? []);
  readonly dataTypes = computed(() => this._model()?.dataTypes ?? []);
  readonly diagrams = computed(() => this._model()?.diagrams ?? []);
  readonly relationships = computed(() => this._model()?.relationships ?? []);

  readonly activeDiagram = computed<LogicalModelDiagram | null>(() =>
    (this.diagrams().find(d => d.id === this._activeDiagramId()) ?? null) as LogicalModelDiagram | null,
  );

  loadModel(dataModelId: number): Observable<LogicalDataModel | null> {
    return defer(() => {
      this.dataModelId = dataModelId;

      this._model.set(null);
      this._loading.set(true);
      this._error.set(null);
      this._activeDiagramId.set(null);
      this._loadedDiagramIds.clear();

      return this.logicalDataModelService.getLogicalDataModel(dataModelId).pipe(
        tap({
          next: model => this._model.set(model),
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
              diagrams: m.diagrams.map(d => d.id === diagram.id ? diagram : d),
            });
          },
          error: err => this._error.set(err),
        }),
        finalize(() => this._loading.set(false)),
      );
    });
  }

  createEntity(entity: LogicalEntitySummary): Observable<LogicalEntity> {
    return this.logicalEntityService.createEntity(this.dataModelId, entity).pipe(
      map(created => ({ ...created, attributes: [] })),
      tap(created => this._model.update(m => m && { ...m, entities: [...m.entities, created] })),
    );
  }

  updateEntity(entity: LogicalEntitySummary): Observable<LogicalEntity> {
    return this.logicalEntityService.updateEntity(this.dataModelId, entity).pipe(
      map(updated => ({ ...updated, attributes: this.entities().find(e => e.entityId === updated.entityId)?.attributes ?? [] })),
      tap(updated => this._model.update(m => m && {
        ...m,
        entities: m.entities.map(e => e.entityId === updated.entityId ? updated : e),
      })),
    );
  }

  deleteEntity(entityId: number): Observable<unknown> {
    return this.logicalEntityService.deleteEntity(this.dataModelId, entityId).pipe(
      tap(() => this._model.update(m => m && {
        ...m,
        entities: m.entities.filter(e => e.entityId !== entityId),
        relationships: m.relationships.filter(r => r.fromEntityId !== entityId && r.toEntityId !== entityId),
      })),
    );
  }

  createAttribute(entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.logicalAttributeService.createAttribute(this.dataModelId, entityId, attribute).pipe(
      tap(created => this._model.update(m => m && {
        ...m,
        entities: m.entities.map(e =>
          e.entityId === entityId ? { ...e, attributes: [...e.attributes, created] } : e,
        ),
      })),
    );
  }

  updateAttribute(entityId: number, attribute: LogicalAttribute): Observable<LogicalAttribute> {
    return this.logicalAttributeService.updateAttribute(this.dataModelId, entityId, attribute).pipe(
      tap(updated => this._model.update(m => m && {
        ...m,
        entities: m.entities.map(e =>
          e.entityId === entityId
            ? { ...e, attributes: e.attributes.map(a => a.attributeId === updated.attributeId ? updated : a) }
            : e,
        ),
      })),
    );
  }

  deleteAttribute(entityId: number, attributeId: number): Observable<AttributeDeletionResult> {
    return this.logicalAttributeService.deleteAttribute(this.dataModelId, entityId, attributeId).pipe(
      map(() => {
        const affectedRelationships: LogicalRelationship[] = (this._model()?.relationships ?? [])
          .filter(rel => rel.attributes.some(a => a.referencedAttributeId === attributeId))
          .map(rel => ({ ...rel, attributes: rel.attributes.filter(a => a.referencedAttributeId !== attributeId) }));

        const affectedById = new Map(affectedRelationships.map(r => [r.relationshipId, r]));

        this._model.update(m => m && {
          ...m,
          entities: m.entities.map(e =>
            e.entityId === entityId
              ? { ...e, attributes: e.attributes.filter(a => a.attributeId !== attributeId) }
              : e,
          ),
          relationships: affectedById.size
            ? m.relationships.map(r => affectedById.get(r.relationshipId as number) ?? r)
            : m.relationships,
        });

        return { affectedRelationships };
      }),
    );
  }

  createRelationship(rel: LogicalRelationship): Observable<LogicalRelationship> {
    return this.logicalRelationshipService.createRelationship(this.dataModelId, rel).pipe(
      tap(created => this._model.update(m => m && { ...m, relationships: [...m.relationships, created] })),
    );
  }

  updateRelationship(rel: LogicalRelationship): Observable<LogicalRelationship> {
    return this.logicalRelationshipService.updateRelationship(this.dataModelId, rel).pipe(
      tap(updated => this._model.update(m => m && {
        ...m,
        relationships: m.relationships.map(r => r.relationshipId === updated.relationshipId ? updated : r),
      })),
    );
  }

  deleteRelationship(relationshipId: number): Observable<unknown> {
    return this.logicalRelationshipService.deleteRelationship(this.dataModelId, relationshipId).pipe(
      tap(() => this._model.update(m => m && {
        ...m,
        relationships: m.relationships.filter(r => r.relationshipId !== relationshipId),
      })),
    );
  }

  createDataType(dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.logicalDataTypeService.createDataType(this.dataModelId, dataType).pipe(
      tap(created => this._model.update(m => m && { ...m, dataTypes: [...m.dataTypes, created] })),
    );
  }

  updateDataType(dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.logicalDataTypeService.updateDataType(this.dataModelId, dataType).pipe(
      tap(updated => this._model.update(m => m && {
        ...m,
        dataTypes: m.dataTypes.map(t => t.typeId === updated.typeId ? updated : t),
      })),
    );
  }

  deleteDataType(typeId: number): Observable<unknown> {
    return this.logicalDataTypeService.deleteDataType(this.dataModelId, typeId).pipe(
      tap(() => this._model.update(m => m && {
        ...m,
        dataTypes: m.dataTypes.filter(t => t.typeId !== typeId),
      })),
    );
  }

  createDiagram(diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramService.createDiagram(this.dataModelId, diagram).pipe(
      tap(created => this._model.update(m => m && { ...m, diagrams: [...m.diagrams, created] })),
    );
  }

  updateDiagram(diagram: DataModelDiagram): Observable<DataModelDiagram> {
    return this.diagramService.updateDiagram(this.dataModelId, diagram).pipe(
      tap(updated => this._model.update(m => m && {
        ...m,
        diagrams: m.diagrams.map(d => d.id === updated.id ? updated : d),
      })),
    );
  }

  deleteDiagram(diagramId: number): Observable<boolean> {
    return this.diagramService.deleteDiagram(this.dataModelId, diagramId).pipe(
      tap(() => this._model.update(m => m && {
        ...m,
        diagrams: m.diagrams.filter(d => d.id !== diagramId),
      })),
    );
  }
}
