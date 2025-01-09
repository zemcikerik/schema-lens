import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  ProjectConnectionErrorAlertComponent
} from '../project-connection-error-alert/project-connection-error-alert.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProjectConnectionError } from '../../models/project-connection-error.model';

@Component({
  selector: 'app-project-connection-error-dialog',
  template: `
    <h2 mat-dialog-title>{{ ('PROJECTS.CONNECTION_ERROR.TITLE_LABEL' | translate)() }}</h2>
    <mat-dialog-content>
      <app-project-connection-error-alert [error]="error" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ ('GENERIC.CLOSE_LABEL' | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButton,
    MatDialogModule,
    ProjectConnectionErrorAlertComponent,
    TranslatePipe,
  ],
})
export class ProjectConnectionErrorDialogComponent {
  error = inject<ProjectConnectionError>(MAT_DIALOG_DATA);
}
