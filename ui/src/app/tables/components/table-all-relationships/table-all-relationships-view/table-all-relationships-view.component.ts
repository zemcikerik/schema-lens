import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import {
  TableRelationshipsDiagramComponent
} from '../../table-relationships-diagram/table-relationships-diagram.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, of } from 'rxjs';
import { TableRelationshipService } from '../../../services/table-relationship.service';
import { LayoutHeaderAndContentComponent } from '../../../../core/layouts/layout-header-and-content.component';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { MatTooltip } from '@angular/material/tooltip';

const NON_ESCAPED_COMMAS_REGEX = /(?<!\\),/;

@Component({
  selector: 'app-table-all-relationships-view',
  templateUrl: './table-all-relationships-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutHeaderAndContentComponent,
    TableRelationshipsDiagramComponent,
    MatIconAnchor,
    MatIcon,
    RouterLink,
    TranslatePipe,
    MatTooltip,
  ],
})
export class TableAllRelationshipsViewComponent {

  projectId = input.required<string>();
  tables = signal<string[]>([]);
  private tableRelationshipService = inject(TableRelationshipService);

  relationshipsResource = rxResource({
    request: () => ({ projectId: this.projectId(), tables: this.tables() }),
    loader: ({ request }) => request.tables.length > 0
      ? this.tableRelationshipService.getRelationshipsOfTables(request.projectId, request.tables)
      : of(null),
  });

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    route.queryParamMap.pipe(
      map(params => params.get('tables')),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(async rawTables => {
      if (rawTables !== null && rawTables.length > 0) {
        this.tables.set(decodeURIComponent(rawTables).split(NON_ESCAPED_COMMAS_REGEX).map(t => t.replaceAll('\\,', ',')));
      } else {
        await router.navigate(['..'], { relativeTo: route });
      }
    });
  }

}
