import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { AlertComponent, AlertType } from '../alert/alert.component';

export interface AlertDialogData {
  titleKey: string;
  messageKey: string;
  type: AlertType;
}

@Component({
  selector: 'app-alert-dialog',
  template: `
    <h2 mat-dialog-title>{{ (data.titleKey | translate)() }}</h2>
    <mat-dialog-content>
      <app-alert [type]="data.type">{{ (data.messageKey | translate)() }}</app-alert>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button [mat-dialog-close]="true">{{ ('GENERIC.CLOSE_LABEL' | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, TranslatePipe, MatButton, AlertComponent],
})
export class AlertDialogComponent {
  data = inject<AlertDialogData>(MAT_DIALOG_DATA);
}
