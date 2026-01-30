import { ChangeDetectionStrategy, Component, computed, viewChild } from '@angular/core';
import { SchemaDiagramComponent } from '../../diagrams/schema/schema-diagram.component';

@Component({
  selector: 'app-logical-er-diagram',
  template: `<app-schema-diagram />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SchemaDiagramComponent],
})
export class LogicalErDiagramComponent {
  private schemaDiagram = viewChild.required(SchemaDiagramComponent);
  diagramHost = computed(() => this.schemaDiagram().diagramHost());
}
