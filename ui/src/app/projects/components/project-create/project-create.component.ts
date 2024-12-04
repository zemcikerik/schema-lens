import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProjectPropertiesFormComponent } from '../project-properties-form/project-properties-form.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { ProjectProperties } from '../../models/project-properties.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-project-create',
  template: `
    <app-content-card>
      <h2>{{ ('PROJECTS.CREATE_LABEL' | translate)() }}</h2>
      @if (loading()) {
        <app-progress-spinner [center]="true" />
      } @else {
        <app-project-properties-form (save)="createProject($event)" />
      }
    </app-content-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProjectPropertiesFormComponent,
    ContentCardComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
  ],
})
export class ProjectCreateComponent {
  loading = signal<boolean>(false);

  private projectService = inject(ProjectService);
  private router = inject(Router);

  createProject(properties: ProjectProperties): void {
    this.loading.set(true);

    this.projectService.createProject(properties)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(() => this.router.navigate(['/project']));
  }
}
