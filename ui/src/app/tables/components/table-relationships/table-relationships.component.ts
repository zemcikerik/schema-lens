import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  TableRelationshipsDiagramComponent
} from '../table-relationships-diagram/table-relationships-diagram.component';
import { TableRelationshipService } from '../../services/table-relationship.service';

@Component({
  selector: 'app-table-relationships',
  templateUrl: './table-relationships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableRelationshipsDiagramComponent],
})
export class TableRelationshipsComponent {
  projectId = input.required<string>();
  tableName = input.required<string>();
  private tableRelationshipService = inject(TableRelationshipService);

  relationshipsResource = rxResource({
    request: () => ({ projectId: this.projectId(), tableName: this.tableName() }),
    loader: ({ request }) => this.tableRelationshipService.getRelationshipsOfTable(request.projectId, request.tableName),
  });
}
