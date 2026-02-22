import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../../core/validators/unique-string.validator';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { DataModelDiagram } from '../../models/data-model-diagram.model';
import { LogicalModelStore } from '../../logical-model.store';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface DataModelDiagramCreateDialogData {
  diagrams: DataModelDiagram[];
}

@Component({
  selector: 'app-data-model-diagram-create-dialog',
  templateUrl: './data-model-diagram-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    AlertComponent,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
    MatError,
  ],
})
export class DataModelDiagramCreateDialogComponent {
  private matDialogRef = inject(MatDialogRef);
  private destroyRef = inject(DestroyRef);

  data = inject<DataModelDiagramCreateDialogData>(MAT_DIALOG_DATA);
  private store = inject(LogicalModelStore);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      noStartEndWhitespaceValidator,
      Validators.maxLength(40),
      uniqueStringValidator(this.data.diagrams.map(e => e.name)),
    ]),
  });

  confirm(): void {
    const { name } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(false);
    this.matDialogRef.disableClose = true;

    this.store
      .createDiagram({ name, type: 'logical', id: null, relationships: [], entities: [] })
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.matDialogRef.disableClose = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: res => this.matDialogRef.close(res),
        error: () => this.error.set(true),
      });
  }
}

