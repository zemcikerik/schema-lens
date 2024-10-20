import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableObjectSelectorComponent } from '../../../tables/components/table-object-selector/table-object-selector.component';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-project-object-selector',
  templateUrl: './project-object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatNavList,
    MatListItem,
    TableObjectSelectorComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class ProjectObjectSelectorComponent {
  projectId = input.required<string>();
}
