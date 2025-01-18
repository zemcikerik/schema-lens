import { ChangeDetectionStrategy, Component, effect, inject, input, Signal, signal, untracked } from '@angular/core';
import { CodeEditorComponent } from '../../../shared/components/code-editor/code-editor.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from '../../services/table.service';
import { finalize, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  isProjectConnectionError,
  ProjectConnectionError,
  ProjectConnectionFailure,
} from '../../../projects/models/project-connection-error.model';
import { catchProjectConnectionError } from '../../../projects/catch-project-connection-error.fn';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-table-ddl',
  templateUrl: './table-ddl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CodeEditorComponent,
    ProgressSpinnerComponent,
    FormsModule,
    ProjectConnectionErrorAlertComponent,
  ],
})
export class TableDdlComponent {
  projectId = input.required<string>();
  tableName = input.required<string>();

  loading = signal(true);
  error = signal<ProjectConnectionError | null>(null);
  ddl = signal<string>('');

  constructor() {
    const tableService = inject(TableService);
    const table = inject(ROUTER_OUTLET_DATA) as Signal<Table | null>;

    effect(onCleanup => {
      // wait until table is loaded by parent
      if (table() === null) {
        return;
      }

      const projectId = this.projectId();
      const tableName = this.tableName();

      const subscription = untracked(() => {
        this.loading.set(true);

        return tableService.getTableDdl(projectId, tableName).pipe(
          catchProjectConnectionError(err => of(err)),
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe({
          next: result => {
            if (!isProjectConnectionError(result)) {
              this.ddl.set(result);
            } else {
              this.error.set(result);
            }
          },
          error: () => this.error.set({ type: ProjectConnectionFailure.UNKNOWN, message: null }),
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
