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
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { HasProjectRolePipe } from '../../pipes/has-project-role.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { ProjectCollaborator } from '../../models/project-collaborator.model';
import { ProjectCollaboratorService } from '../../services/project-collaborator.service';
import { filter, finalize, mergeMap, tap } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import {
  ProjectCollaboratorsTableComponent,
} from './project-collaborators-table/project-collaborators-table.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import {
  AddCollaboratorDialogData,
  ProjectAddCollaboratorDialogComponent,
} from './project-add-collaborator-dialog/project-add-collaborator-dialog.component';
import { ProjectService } from '../../services/project.service';
import { ProjectCollaborationRole } from '../../models/project-collaboration-role.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeCollaboratorRoleDialogData,
  ProjectChangeCollaboratorRoleDialogComponent,
} from './project-change-collaborator-role-dialog/project-change-collaborator-role-dialog.component';
import { DialogService } from '../../../core/dialog.service';

@Component({
  selector: 'app-project-collaborators',
  templateUrl: './project-collaborators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutHeaderAndContentComponent,
    TranslatePipe,
    HasProjectRolePipe,
    MatButton,
    MatIcon,
    IconEmphasisDirective,
    ProgressSpinnerComponent,
    ProjectCollaboratorsTableComponent,
    AlertComponent,
  ],
})
export class ProjectCollaboratorsComponent {
  projectId = input.required<string>();

  private projectService = inject(ProjectService);
  private projectCollaboratorService = inject(ProjectCollaboratorService);
  private dialogService = inject(DialogService);
  private matDialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  collaborators = signal<ProjectCollaborator[]>([]);

  constructor() {
    effect(onCleanup => {
      const projectId = this.projectId();

      const subscription = untracked(() => {
        this.loading.set(true);

        return this.projectCollaboratorService.getProjectCollaborators(projectId).pipe(
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe({
          next: collaborators => this.collaborators.set(collaborators),
          error: () => this.error.set(true),
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  addCollaborator(): void {
    const projectId = this.projectId();
    const allowManagerRole = this.projectService.hasProjectRole(projectId, ProjectCollaborationRole.OWNER)();
    const disallowedUsernames = this.collaborators().map(collaborator => collaborator.username);

    const data: AddCollaboratorDialogData = { allowManagerRole, disallowedUsernames, projectId };

    this.matDialog.open(ProjectAddCollaboratorDialogComponent, { data }).afterClosed().pipe(
      filter(collaborator => collaborator),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(collaborator => this.collaborators.update(collaborators => [...collaborators, collaborator]));
  }

  changeCollaboratorRole(collaborator: ProjectCollaborator): void {
    const projectId = this.projectId();
    const allowManagerRole = this.projectService.hasProjectRole(projectId, ProjectCollaborationRole.OWNER)();
    const { username, role } = collaborator;

    const data: ChangeCollaboratorRoleDialogData = { allowManagerRole, projectId, username, previousRole: role };

    this.matDialog.open(ProjectChangeCollaboratorRoleDialogComponent, { data }).afterClosed().pipe(
      filter(collaborator => collaborator),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((collaborator: ProjectCollaborator) => this.collaborators.update(collaborators => {
      const copiedCollaborators = [...collaborators];
      const index = collaborators.findIndex(c => c.username === collaborator.username);
      copiedCollaborators[index] = collaborator;
      return copiedCollaborators;
    }));
  }

  deleteCollaborator({ username }: ProjectCollaborator): void {
    const projectId = this.projectId();
    const titleKey = 'PROJECTS.COLLABORATORS.DELETE_LABEL';
    const descriptionKey = 'PROJECTS.COLLABORATORS.DELETE_DESCRIPTION';

    this.dialogService.openConfirmationDialog(titleKey, descriptionKey, 'danger').pipe(
      filter(result => !!result),
      tap(() => this.loading.set(true)),
      mergeMap(() => this.projectCollaboratorService.deleteProjectCollaborator(projectId, username)),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => this.collaborators.update(collaborators => collaborators.filter(c => c.username !== username)),
      error: () => this.error.set(true),
    });
  }
}
