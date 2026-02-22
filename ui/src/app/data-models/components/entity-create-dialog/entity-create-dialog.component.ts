import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LogicalEntity } from '../../models/logical-model.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../../core/validators/unique-string.validator';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { LogicalModelStore } from '../../modeler/logical/logical-model.store';

export interface EntityCreateDialogData {
  entities: LogicalEntity[];
}

// TODO: refactor similarly to data-type-create-dialog

@Component({
  selector: 'app-entity-create-dialog',
  templateUrl: './entity-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    TranslatePipe,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    AlertComponent,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
  ],
})
export class EntityCreateDialogComponent {
  private matDialogRef = inject(MatDialogRef);

  data = inject<EntityCreateDialogData>(MAT_DIALOG_DATA);
  private store = inject(LogicalModelStore);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  formControl = new FormControl<string>('', [
    Validators.required,
    noStartEndWhitespaceValidator,
    Validators.maxLength(40),
    uniqueStringValidator(this.data.entities.map(e => e.name)),
  ]);

  confirm = () => {
    const name = this.formControl.value;
    if (!name) return;
    this.loading.set(true);
    this.error.set(false);
    this.store.createEntity({ name: name.toUpperCase(), entityId: null, attributes: [] }).subscribe({
      next: res => {
        this.loading.set(false);
        this.matDialogRef.close(res);
      },
      error: () => {
        this.error.set(true);
      },
    });
  };
}
