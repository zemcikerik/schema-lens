import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavTab, NavTabGroupComponent } from '../shared/components/nav-tab-group/nav-tab-group.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from './services/table.service';
import { filter, tap } from 'rxjs';
import {
  ProjectConnectionErrorAlertComponent
} from '../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { Table } from './models/table.model';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableCacheService } from './services/table-cache.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    NavTabGroupComponent,
    MatIcon,
    MatTooltip,
    TranslatePipe,
    ProgressSpinnerComponent,
    ProjectConnectionErrorAlertComponent,
  ],
})
export class TableComponent {
  readonly TABLE_TABS: NavTab[] = [
    { title: 'TABLES.COLUMNS.LABEL', translateTitle: true, path: 'columns' },
    { title: 'TABLES.CONSTRAINTS.LABEL', translateTitle: true, path: 'constraints' },
    { title: 'TABLES.INDEXES.LABEL', translateTitle: true, path: 'indexes' },
    { title: 'TABLES.DDL.LABEL', translateTitle: true, path: 'ddl' },
    { title: 'TABLES.RELATIONSHIPS.LABEL', translateTitle: true, path: 'relationships' },
  ];

  projectId = input.required<string>();
  tableName = input.required<string>();

  private tableService = inject(TableService);
  private router = inject(Router);

  tableResource = rxResource({
    params: () => ({ projectId: this.projectId(), tableName: this.tableName() }),
    stream: ({ params }) =>
      this.tableService.getTableDetails(params.projectId, params.tableName).pipe(
        tap(table => this.redirectIfNotFound(table)),
      ),
  });

  constructor() {
    inject(TableCacheService).invalidateTable$.pipe(
      filter(({ projectId, tableName }) => projectId === this.projectId() && tableName === this.tableName()),
      takeUntilDestroyed(),
    ).subscribe(() => this.tableResource.reload());
  }

  private async redirectIfNotFound(result: Table | null): Promise<void> {
    if (result === null) {
      await this.router.navigate(['/project', this.projectId(), 'table', '404']);
    }
  }
}
