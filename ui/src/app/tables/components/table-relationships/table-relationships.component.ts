import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import {
  DiagramEntityRelationshipComponent
} from '../../../diagrams/components/diagram-entity-relationship/diagram-entity-relationship.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';
import { TableColumnService } from '../../services/table-column.service';
import { Entity } from '../../../diagrams/models/entity.model';

@Component({
  selector: 'app-table-relationships',
  templateUrl: './table-relationships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DiagramEntityRelationshipComponent],
})
export class TableRelationshipsComponent {
  table = inject<Signal<Table>>(ROUTER_OUTLET_DATA);
  private tableColumnService = inject(TableColumnService);

  entity = computed<Entity>(() => {
    const table = this.table();
    const primaryKeyColumns = this.tableColumnService.getPrimaryKeyColumns(table);

    return {
      name: table.name,
      columns: table.columns.map(column => ({ ...column, primaryKey: primaryKeyColumns.includes(column) }))
    };
  });
}
