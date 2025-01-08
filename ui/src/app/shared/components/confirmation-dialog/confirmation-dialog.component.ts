import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';

export interface ConfirmationDialogData {
  titleKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ (titleKey | translate)() }}</h2>
    <mat-dialog-content>{{ (descriptionKey | translate)() }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ ('GENERIC.CANCEL_LABEL' | translate)() }}</button>
      <button mat-flat-button [mat-dialog-close]="true">{{ ('GENERIC.CONFIRM_LABEL' | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    TranslatePipe,
    MatButton,
  ],
})
export class ConfirmationDialogComponent {
  titleKey: string;
  descriptionKey: string;

  constructor() {
    const { titleKey, descriptionKey }: ConfirmationDialogData = inject(MAT_DIALOG_DATA);
    this.titleKey = titleKey;
    this.descriptionKey = descriptionKey;
  }
}
