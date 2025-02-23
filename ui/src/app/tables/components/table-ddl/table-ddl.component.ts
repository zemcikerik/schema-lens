import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CodeEditorComponent } from '../../../shared/components/code-editor/code-editor.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from '../../services/table.service';
import { FormsModule } from '@angular/forms';
import { unwrapProjectConnectionError } from '../../../projects/catch-project-connection-error.fn';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { rxResource } from '@angular/core/rxjs-interop';

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
  private tableService = inject(TableService);

  ddlResource = rxResource({
    request: () => ({ projectId: this.projectId(), tableName: this.tableName() }),
    loader: ({ request }) =>
      this.tableService.getTableDdl(request.projectId, request.tableName).pipe(unwrapProjectConnectionError()),
  });
}
