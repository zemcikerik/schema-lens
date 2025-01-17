import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ProjectPropertiesFormComponent } from '../project-properties-form/project-properties-form.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { ProjectProperties } from '../../models/project-properties.model';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { finalize } from 'rxjs';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-create',
  template: `
    <app-content-card>
      <app-layout-header-and-content [title]="('PROJECTS.CREATE_LABEL' | translate)()" [includeSpacing]="loading() || error()">
        @if (loading()) {
          <app-progress-spinner [center]="true" />
        } @else if (error()) {
          <app-alert type="error">{{ ('GENERIC.ERROR_LABEL' | translate)() }}</app-alert>
        } @else {
          <app-project-properties-form (save)="createProject($event)" />
        }
      </app-layout-header-and-content>
    </app-content-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProjectPropertiesFormComponent,
    ContentCardComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
    LayoutHeaderAndContentComponent,
    AlertComponent,
  ],
})
export class ProjectCreateComponent {
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private projectService = inject(ProjectService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  createProject(properties: ProjectProperties): void {
    this.loading.set(true);

    this.projectService.createProject(properties).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => this.router.navigate(['/project']),
      error: () => this.error.set(true),
    });
  }
}
