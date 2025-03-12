import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { DiagramHostComponent } from '../diagram-host.component';
import { AngularComponentShapeRenderer, AngularComponentShapeRendererFactory } from '../angular/angular-component-shape-renderer.module';
import { EntityComponent } from './entity/entity.component';
import { Entity } from './entity/entity.model';
import { EntityShape, EntityShapeTemplate } from './entity/entity.shape';
import { Relationship } from './relationship/relationship.model';
import { DiagramZoomControlComponent } from '../diagram-zoom-control.component';
import { Edge, DiagramLayoutService } from '../diagram-layout.service';
import { EntityModule } from './entity/entity.module';
import { RelationshipModule } from './relationship/relationship.module';

@Component({
  selector: 'app-diagram-entity-relationship',
  templateUrl: 'diagram-entity-relationship.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DiagramHostComponent, DiagramZoomControlComponent],
})
export class DiagramEntityRelationshipComponent implements AfterViewInit {
  readonly MODULES = [
    AngularComponentShapeRendererFactory.create({ entity: EntityComponent }),
    EntityModule,
    RelationshipModule,
  ];

  entities = input.required<Entity[]>();
  relationships = input.required<Relationship[]>();

  diagramHost = viewChild.required(DiagramHostComponent);
  private diagramLayoutService = inject(DiagramLayoutService);

  ngAfterViewInit(): void {
    const diagramHost = this.diagramHost();

    const angularRenderer = diagramHost.runInDiagramContext<AngularComponentShapeRenderer>(
      diagram => diagram.get('angularComponentShapeRenderer'),
    );

    const relationships = this.relationships();
    const relationshipsWithIds = relationships.map(
      (relationship, index) => ({ id: `relationship_${index}`, ...relationship }),
    );

    const entitiesWithContext = this.entities().map(entity => {
      const relationshipsToDirectParents = relationships.filter(r => r.childName === entity.name);
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

    const entityShapeMappings: Record<string, EntityShape> = {};

    entitiesWithContext.forEach(({ id, entity, width, height, relationshipsToDirectParents } ) => {
      const { x, y } = laidOutEntities[id];
      const template: EntityShapeTemplate = { id, x, y, width, height, minDimensions: { width, height } };

      const shape = diagramHost.addShape(template) as EntityShape;
      angularRenderer.setShapeInput(shape, 'entity', entity);
      angularRenderer.setShapeInput(shape, 'relationshipsToDirectParents', relationshipsToDirectParents);
      entityShapeMappings[id] = shape;
    });

    const edgeMappings: Record<string, Edge> = {};
    edges.forEach(edge => edgeMappings[edge.id] = edge);

    relationshipsWithIds.forEach(relationship => {
      const { id, fromId, toId } = edgeMappings[relationship.id];

      diagramHost.addConnection({
        id,
        waypoints: laidOutRelationships[id],
        source: entityShapeMappings[fromId],
        target: entityShapeMappings[toId],
        relationship: relationship,
      });
    });
  }
}
