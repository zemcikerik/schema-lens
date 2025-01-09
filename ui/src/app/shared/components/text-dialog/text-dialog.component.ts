import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';

export interface TextDialogData {
  titleKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-text-dialog',
  template: `
    <h2 mat-dialog-title>{{ (titleKey | translate)() }}</h2>
    <mat-dialog-content>{{ (descriptionKey | translate)() }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button [mat-dialog-close]="true">{{ ('GENERIC.CLOSE_LABEL' | translate)() }}</button>
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
export class TextDialogComponent {
  private data = inject<TextDialogData>(MAT_DIALOG_DATA);
  titleKey = this.data.titleKey;
  descriptionKey = this.data.descriptionKey;
}
