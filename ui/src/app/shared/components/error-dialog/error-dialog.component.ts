import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { AlertComponent } from '../alert/alert.component';

export interface ErrorDialogData {
  titleKey: string;
  errorKey: string;
}

@Component({
  selector: 'app-error-dialog',
  template: `
    <h2 mat-dialog-title>{{ (titleKey | translate)() }}</h2>
    <mat-dialog-content>
      <app-alert type="error">{{ (errorKey | translate)() }}</app-alert>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button [mat-dialog-close]="true">{{ ('GENERIC.CLOSE_LABEL' | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, TranslatePipe, MatButton, AlertComponent],
})
export class ErrorDialogComponent {
  private data = inject<ErrorDialogData>(MAT_DIALOG_DATA);
  titleKey = this.data.titleKey;
  errorKey = this.data.errorKey;
}
