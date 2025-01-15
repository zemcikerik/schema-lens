import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { CodeEditorComponent } from '../../../shared/components/code-editor/code-editor.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from '../../services/table.service';
import { childLoadTableSignal } from '../../child-load-table.signal';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-ddl',
  templateUrl: './table-ddl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeEditorComponent,
    ProgressSpinnerComponent,
    FormsModule,
  ],
})
export class TableDdlComponent {
  projectId = input.required<string>();
  tableName = input.required<string>();

  loading = signal(true);
  ddl = signal<string>('');

  constructor() {
    const tableService = inject(TableService);
    const table = childLoadTableSignal(this.projectId, this.tableName);

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
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe(ddl => this.ddl.set(ddl));
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
