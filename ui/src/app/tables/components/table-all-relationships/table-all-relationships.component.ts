import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { TableService } from '../../services/table.service';
import { TableSelectionListComponent } from '../table-selection-list/table-selection-list.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-all-relationships',
  templateUrl: './table-all-relationships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutHeaderAndContentComponent,
    TableSelectionListComponent,
    ProgressSpinnerComponent,
    ReactiveFormsModule,
    MatButton,
    TranslatePipe,
    ProjectConnectionErrorAlertComponent,
  ],
})
export class TableAllRelationshipsComponent {
  projectId = input.required<string>();
  private router = inject(Router);
  private tableService = inject(TableService);

  tablesControl = new FormControl<string[]>([], [Validators.minLength(1)]);
  tableNamesResource = rxResource({
    params: () => ({ projectId: this.projectId() }),
    stream: ({ params }) => this.tableService.getTableNames(params.projectId),
  });

  constructor() {
    effect(() => {
      this.tablesControl.setValue(this.tableNamesResource.value() ?? []);
    });
  }

  async showDiagram(): Promise<void> {
    const tableArray = this.tablesControl.value ?? [];
    const tables = encodeURIComponent(tableArray.map(t => t.replaceAll(',', '\\,')).join(','));
    await this.router.navigate(['/project', this.projectId(), 'table-relationships', 'view'], { queryParams: { tables } });
  }
}
