import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { startWith } from 'rxjs';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { AdminBackupConfiguration } from '../../models/admin-backup.model';

@Component({
  selector: 'app-admin-backup-configuration-form',
  templateUrl: './admin-backup-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    MatSlideToggle,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class AdminBackupConfigurationFormComponent {
  private static readonly ORACLE_DIRECTORY_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,127}$/;

  configuration = input.required<AdminBackupConfiguration>();
  loading = input<boolean>(false);
  save = output<AdminBackupConfiguration>();

  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  configurationForm = this.fb.nonNullable.group({
    automaticEnabled: this.fb.nonNullable.control(false),
    cronExpression: this.fb.nonNullable.control('0 0 2 * * *', [Validators.required]),
    retentionDays: this.fb.nonNullable.control(30, [Validators.required, Validators.max(3650)]),
    oracleDirectoryName: this.fb.nonNullable.control('SCHEMA_LENS_BACKUP_DIR', [
      Validators.required,
      Validators.pattern(AdminBackupConfigurationFormComponent.ORACLE_DIRECTORY_NAME_PATTERN),
    ]),
  });

  constructor() {
    effect(() => {
      this.configurationForm.reset(this.configuration(), { emitEvent: false });
      this.updateAutomaticFieldsState();
    });

    effect(() => {
      if (this.loading()) {
        this.configurationForm.disable({ emitEvent: false });
      } else {
        this.configurationForm.enable({ emitEvent: false });
        this.updateAutomaticFieldsState();
      }
    });

    this.configurationForm.controls.automaticEnabled.valueChanges
      .pipe(
        startWith(this.configurationForm.controls.automaticEnabled.value),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateAutomaticFieldsState());
  }

  submit(): void {
    if (this.configurationForm.invalid) {
      this.configurationForm.markAllAsTouched();
      return;
    }

    const configuration = this.configurationForm.getRawValue();
    const savedConfiguration = this.configuration();

    this.save.emit({
      ...configuration,
      cronExpression: configuration.automaticEnabled
        ? configuration.cronExpression.trim()
        : savedConfiguration.cronExpression,
      retentionDays: configuration.automaticEnabled
        ? configuration.retentionDays
        : savedConfiguration.retentionDays,
      oracleDirectoryName: configuration.automaticEnabled
        ? configuration.oracleDirectoryName.trim()
        : savedConfiguration.oracleDirectoryName,
    });
  }

  private updateAutomaticFieldsState(): void {
    const loading = untracked(() => this.loading());

    const automaticFields = [
      this.configurationForm.controls.cronExpression,
      this.configurationForm.controls.retentionDays,
      this.configurationForm.controls.oracleDirectoryName,
    ];

    automaticFields.forEach(control => {
      if (!loading && this.configurationForm.controls.automaticEnabled.value) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }
    });
  }
}
