import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavTab, NavTabGroupComponent } from '../../../shared/components/nav-tab-group/nav-tab-group.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';

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
    { title: 'Columns', translateTitle: false, path: 'columns' },
  ];

  projectId = input.required<string>();
  tableName = input.required<string>();

  loading = signal<boolean>(false);
}
