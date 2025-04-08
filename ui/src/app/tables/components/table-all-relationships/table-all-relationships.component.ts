import { ChangeDetectionStrategy, Component, effect, inject, Injector, input, Resource, signal } from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { TableService } from '../../services/table.service';
import { TableSelectionListComponent } from '../table-selection-list/table-selection-list.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { TableRelationships } from '../../models/table-relationships.model';
import {
  TableRelationshipsDiagramComponent
} from '../table-relationships-diagram/table-relationships-diagram.component';
import { TableRelationshipService } from '../../services/table-relationship.service';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';

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
    TableRelationshipsDiagramComponent,
    ProjectConnectionErrorAlertComponent,
  ],
})
export class TableAllRelationshipsComponent {
  projectId = input.required<string>();
  private injector = inject(Injector);
  private tableService = inject(TableService);
  private tableRelationshipService = inject(TableRelationshipService);

  tableNamesResource = rxResource({
    request: () => ({ projectId: this.projectId() }),
    loader: ({ request }) => this.tableService.getTableNames(request.projectId),
  });

  tablesControl = new FormControl<string[]>([], [Validators.minLength(1)]);
  relationshipsResource = signal<Resource<TableRelationships> | null>(null);

  constructor() {
    effect(() => {
      this.tablesControl.setValue(this.tableNamesResource.value() ?? []);
    });
  }

  showDiagram(): void {
    const tables = this.tablesControl.value ?? [];

    this.relationshipsResource.set(rxResource({
      loader: () => this.tableRelationshipService.getRelationshipsOfTables(this.projectId(), tables),
      injector: this.injector,
    }));
  }
}
