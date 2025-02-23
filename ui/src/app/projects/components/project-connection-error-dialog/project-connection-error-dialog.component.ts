import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  ProjectConnectionErrorAlertComponent
} from '../project-connection-error-alert/project-connection-error-alert.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

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
  imports: [
    MatButton,
    MatDialogModule,
    ProjectConnectionErrorAlertComponent,
    TranslatePipe,
  ],
})
export class ProjectConnectionErrorDialogComponent {
  error = inject<unknown>(MAT_DIALOG_DATA);
}
