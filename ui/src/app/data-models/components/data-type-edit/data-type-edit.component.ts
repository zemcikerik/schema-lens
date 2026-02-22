import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { LogicalDataType } from '../../models/logical-model.model';
import { Router } from '@angular/router';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';
import { LogicalModelStore } from '../../modeler/logical/logical-model.store';

// TODO: cleanup

@Component({
  selector: 'app-data-type-edit',
  templateUrl: './data-type-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatIcon,
    MatInput,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
    LayoutHeaderAndContentComponent,
    ProgressSpinnerComponent,
    AlertComponent,
  ],
})
export class DataTypeEditComponent {
  dataTypeId = input.required<number>();

  private store = inject(LogicalModelStore);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(40)]),
  });

  type = linkedSignal<LogicalDataType | null>(() => {
    const t = structuredClone(this.store.dataTypes().find(t => t.typeId == this.dataTypeId())) ?? null;
    this.form.patchValue({ name: t?.name ?? '' });
    // TODO: redirect on null
    return t;
  });

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  delete = () => {
    const type = this.type();
    if (type == null || type.typeId == null) return;
    const typeId = type.typeId;
    this.dialogService
      .openConfirmationDialog('DATAMODEL.DATA_TYPE.DELETE.TITLE', 'DATAMODEL.DATA_TYPE.DELETE.DESC', 'danger')
      .subscribe({
        next: res => {
          if (!res) return;
          this.loading.set(true);
          this.error.set(null);
          this.store.deleteDataType(typeId).subscribe({
            next: async deleted => {
              this.loading.set(false);
              if (deleted) {
                await this.router.navigate(['/model', this.store.dataModelId]);
              } else {
                this.error.set('DATAMODEL.DATATYPE.ERROR.IN_USE');
              }
            },
            error: () => {
              this.loading.set(false);
              this.error.set('GENERIC.ERROR_LABEL');
            },
          });
        },
      });
  };

  submit = () => {
    const { name } = this.form.value;
    const type = this.type();
    if (type?.typeId == null || !name) return;
    this.loading.set(true);
    this.error.set(null);
    this.store.updateDataType({ name: name, typeId: type.typeId }).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('GENERIC.ERROR_LABEL');
      },
    });
  };
}
