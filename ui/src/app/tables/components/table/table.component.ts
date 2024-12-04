import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavTab, NavTabGroupComponent } from '../../../shared/components/nav-tab-group/nav-tab-group.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TableService } from '../../services/table.service';
import { finalize } from 'rxjs';

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

  loading = signal<boolean>(false);

  constructor() {
    const tableService = inject(TableService);

    effect(onCleanup => {
      const projectId = this.projectId();
      const tableName = this.tableName();

      const subscription = untracked(() => {
        this.loading.set(true);

        return tableService.getTableDetails(projectId, tableName).pipe(
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe(() => {
          // todo
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
