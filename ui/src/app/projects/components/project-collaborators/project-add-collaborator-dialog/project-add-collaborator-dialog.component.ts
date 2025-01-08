import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ProjectRoleTypeToLabelPipe } from '../../../pipes/project-role-type-to-label.pipe';
import { MatInput } from '@angular/material/input';
import { USERNAME_REGEX } from '../../../../core/auth/auth.service';
import { FormatGenericValidationErrorsPipe } from '../../../../shared/pipes/format-generic-validation-errors.pipe';
import { ProjectCollaboratorService } from '../../../services/project-collaborator.service';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { getApplicableContributorRoles, RoleEntry } from '../get-applicable-contributor-roles.fn';

export interface AddCollaboratorDialogData {
  allowManagerRole: boolean;
  disallowedUsernames: string[];
  projectId: string;
}

@Component({
  selector: 'app-project-add-contributor-dialog',
  templateUrl: './project-add-collaborator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
    MatIcon,
    ReactiveFormsModule,
    MatButton,
    ProjectRoleTypeToLabelPipe,
    MatInput,
    FormatGenericValidationErrorsPipe,
    ProgressSpinnerComponent,
    AlertComponent,
  ],
})
export class ProjectAddCollaboratorDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private projectCollaboratorsService = inject(ProjectCollaboratorService);
  private destroyRef = inject(DestroyRef);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  formGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(64),
      Validators.pattern(USERNAME_REGEX),
    ]),
    role: new FormControl(null, [Validators.required]),
  });
  roles: RoleEntry[];
  projectId : string;

  constructor() {
    const { allowManagerRole, disallowedUsernames, projectId } = inject<AddCollaboratorDialogData>(MAT_DIALOG_DATA);
    this.projectId = projectId;
    this.roles = getApplicableContributorRoles(allowManagerRole);

    this.formGroup.controls.username.addValidators(usernameControl =>
      disallowedUsernames.includes(usernameControl.value) ? { disallowedUsername: true } : null
    );

    effect(() => {
      this.dialogRef.disableClose = this.loading();
    });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const { username, role } = this.formGroup.value;

    if (!username || !role) {
      return;
    }

    this.loading.set(true);

    this.projectCollaboratorsService.addProjectCollaborator(this.projectId, username, role).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: collaborator => {
        if (collaborator !== null) {
          this.dialogRef.close(collaborator);
        } else {
          this.error.set('PROJECTS.COLLABORATORS.USER_NOT_EXISTS_ERROR');
        }
      },
      error: () => this.error.set('GENERIC.ERROR_LABEL'),
    });
  }
}
