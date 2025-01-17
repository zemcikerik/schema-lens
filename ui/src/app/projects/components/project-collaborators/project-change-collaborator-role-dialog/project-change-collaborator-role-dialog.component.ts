import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MatIcon } from '@angular/material/icon';
import { ProjectRoleTypeToLabelPipe } from '../../../pipes/project-role-type-to-label.pipe';
import { ProjectCollaboratorService } from '../../../services/project-collaborator.service';
import { ProjectCollaborationRole } from '../../../models/project-collaboration-role.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { getApplicableContributorRoles, RoleEntry } from '../get-applicable-contributor-roles.fn';
import { MatInput } from '@angular/material/input';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ChangeCollaboratorRoleDialogData {
  allowManagerRole: boolean;
  projectId: string;
  username: string;
  previousRole: ProjectCollaborationRole;
}

@Component({
  selector: 'app-project-change-collaborator-role-dialog',
  templateUrl: './project-change-collaborator-role-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
    MatButton,
    ProgressSpinnerComponent,
    AlertComponent,
    MatIcon,
    ProjectRoleTypeToLabelPipe,
    MatInput,
    ReactiveFormsModule,
  ],
})
export class ProjectChangeCollaboratorRoleDialogComponent {
  private dialogRef = inject(MatDialogRef);
  readonly projectCollaboratorService = inject(ProjectCollaboratorService);
  readonly destroyRef = inject(DestroyRef);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  roleControl: FormControl<ProjectCollaborationRole | null>;
  roles: RoleEntry[];
  username: string;
  projectId: string;

  constructor() {
    const { allowManagerRole, projectId, username, previousRole } = inject<ChangeCollaboratorRoleDialogData>(MAT_DIALOG_DATA);
    this.roleControl = new FormControl<ProjectCollaborationRole>(previousRole, [Validators.required]);
    this.roles = getApplicableContributorRoles(allowManagerRole);
    this.projectId = projectId;
    this.username = username;

    effect(() => {
      this.dialogRef.disableClose = this.loading();
    });
  }

  submit(): void {
    if (this.roleControl.invalid) {
      this.roleControl.markAsTouched();
      return;
    }

    const role = this.roleControl.value;

    if (role === null) {
      return;
    }

    this.loading.set(true);

    this.projectCollaboratorService.updateProjectCollaborator(this.projectId, this.username, role).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: collaborator => this.dialogRef.close(collaborator),
      error: () => this.error.set(true),
    });
  }
}
