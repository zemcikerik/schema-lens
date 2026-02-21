import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { DataType, LogicalDataModel } from '../../models/logical-model.model';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { DataTypeService } from '../../services/data-type.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';

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
  dataModelId = input.required<number>();
  logicalModel = inject(ROUTER_OUTLET_DATA) as Signal<LogicalDataModel>;

  private dataTypeService = inject(DataTypeService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(40)]),
  });

  type = linkedSignal<DataType | null>(() => {
    const t = structuredClone(this.logicalModel().dataTypes.find(t => t.typeId == this.dataTypeId())) ?? null;
    this.form.patchValue({ name: t?.name ?? '' });
    // TODO: redirect on null
    return t;
  });

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  delete = () => {
    const type = this.type();
    if (type == null) return;
    this.dialogService
      .openConfirmationDialog('DATAMODEL.DATA_TYPE.DELETE.TITLE', 'DATAMODEL.DATA_TYPE.DELETE.DESC', 'danger')
      .subscribe({
        next: res => {
          if (!res) return;
          this.loading.set(true);
          this.error.set(null);
          this.dataTypeService.deleteDataType(this.dataModelId(), type).subscribe({
            next: async res => {
              this.loading.set(false);
              if (res) await this.router.navigate(['/model', this.dataModelId()]);
              this.error.set('DATAMODEL.DATATYPE.ERROR.IN_USE');
            },
            error: () => {
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
    this.dataTypeService.updateDataType(this.dataModelId(), { name: name, typeId: type.typeId }).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.error.set('GENERIC.ERROR_LABEL');
      },
    });
  };
}
