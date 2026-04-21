import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { FormatGenericValidationErrorsPipe } from '../../pipes/format-generic-validation-errors.pipe';

export interface InputDialogData {
  titleKey: string;
  labelKey: string;
  placeholderKey?: string;
  initialValue?: string;
  confirmLabelKey?: string;
  cancelLabelKey?: string;
  validators?: ValidatorFn[];
}

@Component({
  selector: 'app-input-dialog',
  template: `
    <h2 mat-dialog-title>{{ (titleKey | translate)() }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="w-100">
          <mat-label>{{ (labelKey | translate)() }}</mat-label>
          <input
            type="text"
            matInput
            required
            formControlName="value"
            [placeholder]="placeholderKey ? (placeholderKey | translate)() : ''"
            (keydown.enter)="confirm()" />
          @if (form.controls.value.invalid && (form.controls.value.touched || form.controls.value.dirty)) {
            <mat-error>{{ (form.controls.value.errors | formatGenericValidationErrors)() }}</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">{{ (cancelLabelKey | translate)() }}</button>
      <button mat-flat-button (click)="confirm()" [disabled]="form.invalid">{{ (confirmLabelKey | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    ReactiveFormsModule,
    FormatGenericValidationErrorsPipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class InputDialogComponent {
  private dialogRef = inject(MatDialogRef<InputDialogComponent, string>);
  private data = inject<InputDialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  titleKey = this.data.titleKey;
  labelKey = this.data.labelKey;
  placeholderKey = this.data.placeholderKey;
  confirmLabelKey = this.data.confirmLabelKey ?? 'GENERIC.CONFIRM_LABEL';
  cancelLabelKey = this.data.cancelLabelKey ?? 'GENERIC.CANCEL_LABEL';

  form = this.fb.nonNullable.group({
    value: this.fb.nonNullable.control(this.data.initialValue ?? '', this.data.validators ?? []),
  });

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.controls.value.markAsTouched();
      return;
    }

    this.dialogRef.close(this.form.controls.value.value);
  }
}

