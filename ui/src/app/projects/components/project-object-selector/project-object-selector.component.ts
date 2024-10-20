import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableObjectSelectorComponent } from '../../../tables/components/table-object-selector/table-object-selector.component';

@Component({
  selector: 'app-project-object-selector',
  templateUrl: './project-object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TableObjectSelectorComponent,
  ],
})
export class ProjectObjectSelectorComponent {
  projectId = input.required<string>();
}
