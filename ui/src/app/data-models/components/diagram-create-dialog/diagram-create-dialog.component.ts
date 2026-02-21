import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { Diagram } from '../../models/diagram';
import { DataModelDiagramService } from '../../services/data-model-diagram.service';

export interface DiagramCreateDialogData {
  modelId: number;
  diagrams: Diagram[];
}

// TODO: refactor similarly to data-type-create-dialog

@Component({
  selector: 'app-diagram-create-dialog',
  templateUrl: './diagram-create-dialog.component.html',
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
export class DiagramCreateDialogComponent {
  private matDialogRef = inject(MatDialogRef);

  data = inject<DiagramCreateDialogData>(MAT_DIALOG_DATA);
  diagramService = inject(DataModelDiagramService);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  formControl = new FormControl<string>('', [
    Validators.required,
    noStartEndWhitespaceValidator,
    Validators.maxLength(40),
    uniqueStringValidator(this.data.diagrams.map(e => e.name)),
  ]);

  confirm = () => {
    const name = this.formControl.value;
    if (!name) return;
    this.loading.set(true);
    this.error.set(false);
    this.diagramService
      .createDiagram(this.data.modelId, { name: name, type: 'Logical', id: null, relationships: null, entities: null })
      .subscribe({
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
