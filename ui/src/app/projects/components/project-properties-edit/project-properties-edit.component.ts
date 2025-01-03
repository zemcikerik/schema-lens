import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../services/project.service';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { ProjectPropertiesFormComponent } from '../project-properties-form/project-properties-form.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProjectProperties } from '../../models/project-properties.model';
import { DialogService } from '../../../core/dialog.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-project-properties-edit',
  template: `
    <h2>{{ ('PROJECTS.PROPERTIES.LABEL' | translate)() }}</h2>
    @if (loading()) {
      <app-progress-spinner [center]="true" />
    } @else if (projectProperties()) {
      <app-project-properties-form
        [properties]="projectProperties()"
        (delete)="deleteProject()"
        (save)="updateProperties($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProjectPropertiesFormComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
  ],
})
export class ProjectPropertiesEditComponent {
  projectId = input.required<string>();
  loading = signal<boolean>(false);
  projectProperties = signal<ProjectProperties | null>(null);

  private dialogService = inject(DialogService);
  private projectService = inject(ProjectService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(onCleanup => {
      const projectId = this.projectId();

      const subscription = untracked(() => {
        this.loading.set(true);
        return this.projectService.getProjectProperties(projectId)
          .pipe(finalize(() => untracked(() => this.loading.set(false))))
          .subscribe(properties => this.projectProperties.set(properties));
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  updateProperties(properties: ProjectProperties): void {
    this.loading.set(true);
    this.projectService.updateProject(this.projectId(), properties).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe(properties => this.projectProperties.set(properties));
  }

  deleteProject(): void {
    const projectId = this.projectId();

    this.dialogService.openConfirmationDialog('GENERIC.CONFIRM_LABEL', 'PROJECTS.DELETE_CONFIRM_DESCRIPTION').pipe(
      filter(result => result === true),
      tap(() => this.loading.set(true)),
      switchMap(() => this.projectService.deleteProject(projectId).pipe(
        finalize(() => this.loading.set(false))
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
