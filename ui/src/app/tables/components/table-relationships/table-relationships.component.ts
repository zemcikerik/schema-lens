import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import {
  DiagramEntityRelationshipComponent
} from '../../../diagrams/components/diagram-entity-relationship/diagram-entity-relationship.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-table-relationships',
  templateUrl: './table-relationships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DiagramEntityRelationshipComponent],
})
export class TableRelationshipsComponent {
  table = inject<Signal<Table>>(ROUTER_OUTLET_DATA);
}
