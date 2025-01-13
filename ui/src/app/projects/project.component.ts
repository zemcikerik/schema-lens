import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../shared/components/content-card/content-card.component';
import { ProjectNavComponent } from './components/project-nav/project-nav.component';
import { Router, RouterOutlet } from '@angular/router';
import { ProjectService } from './services/project.service';
import { finalize } from 'rxjs';
import { ProgressSpinnerComponent } from '../shared/components/progress-spinner/progress-spinner.component';

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
    ProgressSpinnerComponent,
  ],
})
export class ProjectComponent {
  projectId = input.required<string>();
  loading = signal<boolean>(false);
  private router = inject(Router);

  constructor() {
    const projectService = inject(ProjectService);

    effect(onCleanup => {
      const projectId = this.projectId();

      if (!projectService.isProjectAvailable(projectId)) {
        this.router.navigate(['/project']);
        return;
      }

      const subscription = untracked(() => {
        this.loading.set(true);

        return projectService.getProjectProperties(projectId).pipe(
          finalize(() => this.loading.set(false)),
        ).subscribe(() => {
          // todo
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
