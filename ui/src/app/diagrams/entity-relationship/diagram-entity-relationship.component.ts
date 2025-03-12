import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { DiagramHostComponent } from '../diagram-host.component';
import { AngularComponentShapeRenderer, AngularComponentShapeRendererFactory } from '../angular/angular-component-shape-renderer.module';
import { EntityComponent } from './entity/entity.component';
import { Entity } from './entity/entity.model';
import { EntityShape, EntityShapeTemplate } from './entity/entity.shape';
import { Relationship, RelationshipWithId } from './relationship/relationship.model';
import { DiagramZoomControlComponent } from '../diagram-zoom-control.component';
import { Edge, DiagramLayoutService } from '../diagram-layout.service';
import { EntityModule } from './entity/entity.module';
import { RelationshipModule } from './relationship/relationship.module';
import { AngularSelectionSupportModuleFactory } from '../angular/angular-selection-support.module';
import { Connection, ElementLike } from 'diagram-js/lib/model/Types';
import { isConnection } from 'diagram-js/lib/util/ModelUtil';
import { isRelationshipConnection, RelationshipConnection } from './relationship/relationship.connection';

@Component({
  selector: 'app-diagram-entity-relationship',
  templateUrl: 'diagram-entity-relationship.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DiagramHostComponent, DiagramZoomControlComponent],
})
export class DiagramEntityRelationshipComponent implements AfterViewInit {
  readonly MODULES = [
    AngularComponentShapeRendererFactory.create({ entity: EntityComponent }),
    AngularSelectionSupportModuleFactory.create({
      selectionChange: (_, newSelection) => this.updateRelationshipHighlightFromSelection(newSelection),
    }),
    EntityModule,
    RelationshipModule,
  ];

  entities = input.required<Entity[]>();
  relationships = input.required<Relationship[]>();
  diagramHost = viewChild.required(DiagramHostComponent);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private angularRenderer: AngularComponentShapeRenderer = null!; // initialized after view init
  private diagramLayoutService = inject(DiagramLayoutService);

  entityShapeMappings: Record<string, EntityShape> = {};
  entityShapeIdsWithRelationshipHighlight = new Set<string>();

  ngAfterViewInit(): void {
    const diagramHost = this.diagramHost();

    this.angularRenderer = diagramHost.runInDiagramContext<AngularComponentShapeRenderer>(
      diagram => diagram.get('angularComponentShapeRenderer'),
    );

    const relationshipsWithIds: RelationshipWithId[] = this.relationships().map(
      (relationship, index) => ({ id: `relationship_${index}`, ...relationship }),
    );

    const entitiesWithContext = this.entities().map(entity => {
      const relationshipsToDirectParents = relationshipsWithIds.filter(r => r.childName === entity.name);
      const { width, height } = EntityComponent.estimateDimensions(entity, relationshipsToDirectParents);
      return { id: `entity_${entity.name}` as const, width, height, entity, relationshipsToDirectParents };
    });

    const edges: Edge[] = relationshipsWithIds.map(({ parentName, childName }, index) => {
      return { id: `relationship_${index}`, fromId: `entity_${parentName}`, toId: `entity_${childName}` };
    });

    const {
      nodes: laidOutEntities,
      edges: laidOutRelationships
    } = this.diagramLayoutService.layoutDigraph(entitiesWithContext, edges);

    entitiesWithContext.forEach(({ id, entity, width, height, relationshipsToDirectParents } ) => {
      const { x, y } = laidOutEntities[id];
      const template: EntityShapeTemplate = { id, x, y, width, height, minDimensions: { width, height } };

      const shape = diagramHost.addShape(template) as EntityShape;
      this.angularRenderer.setShapeInput(shape, 'entity', entity);
      this.angularRenderer.setShapeInput(shape, 'relationshipsToDirectParents', relationshipsToDirectParents);
      this.entityShapeMappings[id] = shape;
    });

    const edgeMappings: Record<string, Edge> = {};
    edges.forEach(edge => edgeMappings[edge.id] = edge);

    relationshipsWithIds.forEach(relationship => {
      const { id, fromId, toId } = edgeMappings[relationship.id];

      diagramHost.addConnection({
        id,
        waypoints: laidOutRelationships[id],
        source: this.entityShapeMappings[fromId],
        target: this.entityShapeMappings[toId],
        relationship: relationship,
      });
    });
  }

  private updateRelationshipHighlightFromSelection(selection: ElementLike[]): void {
    const highlightUpdates: Record<string, string[]> = {};

    this.entityShapeIdsWithRelationshipHighlight.forEach(id => highlightUpdates[id] = []);
    this.entityShapeIdsWithRelationshipHighlight = new Set();

    this.resolveSelectedRelationshipConnections(selection).forEach(connection => {
      const entityId = `entity_${connection.relationship.childName}`;

      if (!(entityId in highlightUpdates)) {
        highlightUpdates[entityId] = [];
      }

      highlightUpdates[entityId].push(connection.id);
      this.entityShapeIdsWithRelationshipHighlight.add(entityId);
    });

    Object.entries(highlightUpdates).forEach(([entityId, highlightRelationshipIds]) => {
      const entityShape = this.entityShapeMappings[entityId];
      this.angularRenderer.setShapeInput(entityShape, 'highlightRelationshipIds', highlightRelationshipIds);
    });
  }

  private resolveSelectedRelationshipConnections(selection: ElementLike[]): RelationshipConnection[] {
    return selection.some(element => !isConnection(element) || !isRelationshipConnection(element as Connection))
      ? [] : selection as RelationshipConnection[];
  }
}
