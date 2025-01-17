import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { TranslateService } from '../../../core/translate/translate.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { AlertComponent } from '../alert/alert.component';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-locale-dialog',
  templateUrl: './change-locale-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    TranslatePipe,
    MatButton,
    MatFormFieldModule,
    MatSelectModule,
    MatIcon,
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    AlertComponent,
  ],
})
export class ChangeLocaleDialogComponent {
  private dialogRef = inject(MatDialogRef<ChangeLocaleDialogComponent>);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  availableLocales = this.translateService.availableLocales;
  currentLocale = this.translateService.locale;

  selectedLocale = new FormControl<string>('');
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.selectedLocale.setValue(this.currentLocale());
    });

    effect(() => {
      this.dialogRef.disableClose = this.loading();
    });
  }

  changeLocale(): void {
    const locale = this.selectedLocale.value;

    if (!locale || this.availableLocales().findIndex(l => l.code === locale) === -1) {
      return;
    }

    if (locale === this.currentLocale()) {
      this.dialogRef.close(false);
      return;
    }

    this.loading.set(true);

    this.translateService.setLocale(locale).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      error: () => this.error.set(true),
      complete: () => this.dialogRef.close(true),
    });
  }
}
