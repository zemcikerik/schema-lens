import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminFaqPost } from '../../models/admin-faq-post.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { MatInput } from '@angular/material/input';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';

export interface AdminFaqModifyDialogData {
  locales: string[];
  faqPost?: AdminFaqPost;
}

@Component({
  selector: 'app-admin-faq-modify-dialog',
  templateUrl: './admin-faq-modify-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButton,
    TranslatePipe,
    ReactiveFormsModule,
    FormatGenericValidationErrorsPipe,
    MatInput,
  ],
})
export class AdminFaqModifyDialogComponent {
  locales: string[];
  faqPost: AdminFaqPost | null;

  formGroup = new FormGroup({
    locale: new FormControl<string | null>(null, [Validators.required]),
    title: new FormControl<string>('', [
      Validators.required,
      noStartEndWhitespaceValidator,
      Validators.minLength(3),
      Validators.maxLength(128),
    ]),
    answer: new FormControl<string>('', [
      Validators.required,
      noStartEndWhitespaceValidator,
      Validators.minLength(3),
      Validators.maxLength(2048),
    ]),
  });

  private dialogRef = inject(MatDialogRef);

  constructor() {
    const { locales, faqPost } = inject<AdminFaqModifyDialogData>(MAT_DIALOG_DATA);
    this.locales = locales;
    this.faqPost = faqPost ?? null;

    if (faqPost) {
      const { locale, title, answer } = faqPost;
      this.formGroup.setValue({ locale, title, answer });
      this.formGroup.controls.locale.disable();
    }
  }

  submit(): void {
    const { locale: localeFromForm, title, answer } = this.formGroup.value;
    const locale = localeFromForm ?? this.faqPost?.locale;

    if (this.formGroup.value && locale && title && answer) {
      this.dialogRef.close({ locale, title, answer });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
