import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../../../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProjectObjectSelectorComponent } from '../project-object-selector/project-object-selector.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    AlertComponent,
    ProjectObjectSelectorComponent,
    RouterOutlet,
  ],
})
export class ProjectComponent {
  projectId = input.required<string>();
}
