import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableObjectSelectorComponent } from '../../../tables/components/table-object-selector/table-object-selector.component';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

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
    TranslatePipe,
  ],
})
export class ProjectObjectSelectorComponent {
  projectId = input.required<string>();
}
