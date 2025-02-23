import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  DiagramEntityRelationshipComponent
} from '../../../diagrams/entity-relationship/diagram-entity-relationship.component';
import { TableColumnService } from '../../services/table-column.service';
import { TableService } from '../../services/table.service';
import { TableRelationships } from '../../models/table-relationships.model';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { unwrapProjectConnectionError } from '../../../projects/catch-project-connection-error.fn';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';

@Component({
  selector: 'app-table-relationships',
  templateUrl: './table-relationships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DiagramEntityRelationshipComponent, ProgressSpinnerComponent, ProjectConnectionErrorAlertComponent],
})
export class TableRelationshipsComponent {
  projectId = input.required<string>();
  tableName = input.required<string>();

  private tableService = inject(TableService);
  private tableColumnService = inject(TableColumnService);

  tableRelationshipsResource = rxResource({
    request: () => ({ projectId: this.projectId(), tableName: this.tableName() }),
    loader: ({ request }) =>
      this.tableService.getRelatedTables(request.projectId, request.tableName).pipe(unwrapProjectConnectionError()),
  });

  tableRelationships = computed<TableRelationships>(() =>
    this.tableRelationshipsResource.value() ?? { tables: [], relationships: [] });

  entities = computed(() => this.tableRelationships().tables.map(table => {
    const primaryKeyColumns = this.tableColumnService.getPrimaryKeyColumns(table);
    return {
      name: table.name,
      columns: table.columns.map(
        column => ({ ...column, primaryKey: primaryKeyColumns.includes(column) })
      ),
    };
  }));
  relationships = computed(() => this.tableRelationships().relationships);
}
