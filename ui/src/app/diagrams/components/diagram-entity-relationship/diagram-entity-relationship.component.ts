import { AfterViewInit, ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { DiagramHostComponent } from '../diagram-host/diagram-host.component';
import AngularComponentShapeRendererFactory from '../../modules/angular-component-shape.renderer';
import type { AngularComponentShapeRenderer } from '../../modules/angular-component-shape.renderer';
import { DiagramEmbeddedEntityComponent } from '../diagram-embedded-entity/diagram-embedded-entity.component';
import { Entity } from '../../models/entity.model';

@Component({
  selector: 'app-diagram-entity-relationship',
  template: '<app-diagram-host [modules]="MODULES" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DiagramHostComponent,
  ],
})
export class DiagramEntityRelationshipComponent implements AfterViewInit {
  readonly MODULES = [
    AngularComponentShapeRendererFactory.create({
      entity: DiagramEmbeddedEntityComponent,
    }),
  ];

  entities = input.required<Entity[]>();
  diagramHost = viewChild.required(DiagramHostComponent);

  ngAfterViewInit(): void {
    const diagramHost = this.diagramHost();

    const angularRenderer = diagramHost.runInDiagramContext<AngularComponentShapeRenderer>(
      diagram => diagram.get('angularComponentShapeRenderer')
    );

    this.entities().forEach((entity, index) => {
      const { width, height } = DiagramEmbeddedEntityComponent.estimateDimensions(entity);
      const shape = diagramHost.addShape({ id: `entity_${index}`, x: 10, y: 10, width, height });
      diagramHost.runInDiagramContext(() => angularRenderer.setShapeInput(shape, 'entity', entity));
    });
  }
}
