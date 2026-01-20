import { afterNextRender, ChangeDetectionStrategy, Component, inject, Injector, input, Resource } from '@angular/core';
import { TableRelationships } from '../../models/table-relationships.model';
import { TableColumnService } from '../../services/table-column.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { SchemaDiagramComponent } from '../../../diagrams/schema/schema-diagram.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, Subject, switchMap } from 'rxjs';
import { SchemaDiagramPatch } from '../../../diagrams/schema/model/schema-diagram-patches.model';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import {
  EDGE_TYPE_ONE_TO_MANY,
  EDGE_TYPE_ONE_TO_ONE,
  SchemaDiagramEdge,
} from '../../../diagrams/schema/model/schema-diagram-edge.model';

@Component({
  selector: 'app-table-relationships-diagram',
  templateUrl: './table-relationships-diagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerComponent,
    ProjectConnectionErrorAlertComponent,
    AlertComponent,
    TranslatePipe,
    SchemaDiagramComponent,
  ],
})
export class TableRelationshipsDiagramComponent {
  relationshipsResource = input.required<Resource<TableRelationships | null | undefined>>();
  private tableColumnService = inject(TableColumnService);

  readonly patches$ = new Subject<SchemaDiagramPatch>();

  constructor() {
    const injector = inject(Injector);

    toObservable(this.relationshipsResource, { injector }).pipe(
      switchMap(resource => toObservable(resource.value, { injector })),
      filter(value => !!value),
      takeUntilDestroyed(),
    ).subscribe(tableRelationships => {
      const { nodes, edges } = this.mapToSchemaModel(tableRelationships);

      afterNextRender({
        mixedReadWrite: () => {
          nodes.forEach(node => this.patches$.next({ type: 'node:add', node }));
          edges.forEach(edge => this.patches$.next({ type: 'edge:add', edge }));
          this.patches$.next({ type: 'layout:auto' });
        },
      }, { injector });
    });
  }

  private mapToSchemaModel({ tables, relationships }: TableRelationships): { nodes: SchemaDiagramNode[], edges: SchemaDiagramEdge[] } {
    const nameToNode: Record<string, SchemaDiagramNode> = {};
    const edges: SchemaDiagramEdge[] = [];

    tables.forEach((table, index) => {
      const primaryKeyColumns = this.tableColumnService.getPrimaryKeyColumns(table);

      nameToNode[table.name] = {
        id: index,
        name: table.name,
        parentEdges: [],
        fields: table.columns.map(column => ({
          name: column.name,
          type: column.type,
          key: primaryKeyColumns.includes(column),
          nullable: column.nullable,
        })),
        uniqueFieldGroups: this.tableColumnService.getUniqueColumnGroupNamesWithoutPrimaryKey(table),
      };
    });

    relationships.forEach((relationship, index) => {
      const fromNode = nameToNode[relationship.parentName];
      const toNode = nameToNode[relationship.childName];

      if (!fromNode || !toNode) {
        return;
      }

      const edge: SchemaDiagramEdge = {
        id: index,
        fromNode: fromNode.id,
        toNode: toNode.id,
        type: relationship.unique ? EDGE_TYPE_ONE_TO_ONE : EDGE_TYPE_ONE_TO_MANY,
        identifying: relationship.identifying,
        mandatory: relationship.mandatory,
        references: relationship.references.map(reference =>
          ({ fromFieldName: reference.parentColumnName, toFieldName: reference.childColumnName })
        ),
      };

      toNode.parentEdges.push(edge);
      edges.push(edge);
    });

    return { nodes: Object.values(nameToNode), edges };
  }
}
