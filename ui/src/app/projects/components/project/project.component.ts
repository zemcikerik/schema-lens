import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../../../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { ProjectNavComponent } from '../project-nav/project-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    ProjectNavComponent,
    RouterOutlet,
  ],
})
export class ProjectComponent {
  projectId = input.required<string>();
}
