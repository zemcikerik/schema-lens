import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavTab, NavTabGroupComponent } from '../../../shared/components/nav-tab-group/nav-tab-group.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from '../../services/table.service';
import { finalize, of } from 'rxjs';
import {
  isProjectConnectionError,
  ProjectConnectionError,
  ProjectConnectionFailure,
} from '../../../projects/models/project-connection-error.model';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { catchProjectConnectionError } from '../../../projects/catch-project-connection-error.fn';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    { title: 'Properties', translateTitle: false, path: 'properties' },
    { title: 'TABLES.COLUMNS.LABEL', translateTitle: true, path: 'columns' },
    { title: 'Constraints', translateTitle: false, path: 'constraints' },
  ];

  projectId = input.required<string>();
  tableName = input.required<string>();
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<ProjectConnectionError | null>(null);

  constructor() {
    const tableService = inject(TableService);

    effect(onCleanup => {
      const projectId = this.projectId();
      const tableName = this.tableName();

      const subscription = untracked(() => {
        this.loading.set(true);

        return tableService.getTableDetails(projectId, tableName).pipe(
          catchProjectConnectionError(err => of(err)),
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe({
          next: result => this.handleResult(result),
          error: () => this.error.set({ type: ProjectConnectionFailure.UNKNOWN, message: null }),
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  private async handleResult(result: unknown): Promise<void> {
    if (result === null) {
      await this.router.navigate(['/project', this.projectId(), 'table', '404']);
    } else if (isProjectConnectionError(result)) {
      this.error.set(result);
    }
  }
}
