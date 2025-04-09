import { ChangeDetectionStrategy, Component, computed, inject, input, Resource } from '@angular/core';
import { TableRelationships } from '../../models/table-relationships.model';
import { TableColumnService } from '../../services/table-column.service';
import { Entity } from '../../../diagrams/entity-relationship/entity/entity.model';
import {
  Relationship,
  RelationshipReference,
} from '../../../diagrams/entity-relationship/relationship/relationship.model';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import {
  DiagramEntityRelationshipComponent
} from '../../../diagrams/entity-relationship/diagram-entity-relationship.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-relationships-diagram',
  templateUrl: './table-relationships-diagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerComponent,
    ProjectConnectionErrorAlertComponent,
    DiagramEntityRelationshipComponent,
    AlertComponent,
    TranslatePipe,
  ],
})
export class TableRelationshipsDiagramComponent {
  relationshipsResource = input.required<Resource<TableRelationships | null>>();
  private tableColumnService = inject(TableColumnService);

  tableRelationships = computed<TableRelationships>(() =>
    this.relationshipsResource().value() ?? { tables: [], relationships: [] });

  entities = computed<Entity[]>(() => this.tableRelationships().tables.map(table => {
    const primaryKeyColumns = this.tableColumnService.getPrimaryKeyColumns(table);
    return {
      name: table.name,
      attributes: table.columns.map(
        column => ({ ...column, primaryKey: primaryKeyColumns.includes(column) })
      ),
      uniqueGroups: this.tableColumnService.getUniqueColumnGroupNamesWithoutPrimaryKey(table),
    };
  }));

  relationships = computed<Relationship[]>(() => this.tableRelationships().relationships.map(relationship => {
    const references: RelationshipReference[] = relationship.references.map(ref => ({
      parentAttributeName: ref.parentColumnName,
      childAttributeName: ref.childColumnName,
    }));

    return { ...relationship, references };
  }));
}
