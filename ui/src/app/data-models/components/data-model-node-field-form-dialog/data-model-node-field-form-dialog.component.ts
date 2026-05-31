import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { DataModelDataTypeNameFieldComponent } from '../data-model-data-type-name-field/data-model-data-type-name-field.component';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { DataModelField } from '../../models/data-model-node.model';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { dataModelFieldNameValidators } from '../../validators/data-model-name.validators';
import { DataModelContextState } from '../../data-model-context.state';

export interface DataModelNodeFieldFormDialogData {
  field: DataModelField | null;
  dataTypes: DataModelDataType[];
  existingFieldNames: string[];
}

type DataTypeParameterFormGroup = FormGroup<{
  name: FormControl<string>;
  value: FormControl<string>;
}>;

@Component({
  selector: 'app-data-model-node-field-form-dialog',
  templateUrl: './data-model-node-field-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatError,
    MatButton,
    DataModelDataTypeNameFieldComponent,
    FormatGenericValidationErrorsPipe,
    TranslatePipe,
  ],
})
export class DataModelNodeFieldFormDialogComponent {
  private matDialogRef = inject(MatDialogRef<DataModelNodeFieldFormDialogComponent, DataModelField>);
  readonly data = inject<DataModelNodeFieldFormDialogData>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  private contextState = inject(DataModelContextState);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.field?.name ?? '', dataModelFieldNameValidators(this.data.existingFieldNames)),
    typeName: this.fb.nonNullable.control(this.getInitialTypeName(), [Validators.required]),
    isPrimaryKey: this.fb.nonNullable.control(this.data.field?.isPrimaryKey ?? false),
    isNullable: this.fb.nonNullable.control({
      value: this.data.field?.isNullable ?? true,
      disabled: this.data.field?.isPrimaryKey ?? false,
    }),
    typeParameters: this.fb.array<DataTypeParameterFormGroup>([]),
  });

  isPhysicalContext = this.contextState.layer() === 'physical';

  constructor() {
    const { isPrimaryKey, isNullable, typeName } = this.form.controls;

    isPrimaryKey.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (value) {
        isNullable.setValue(false);
        isNullable.disable();
      } else {
        isNullable.enable();
      }
    });

    this.resetParameterControls(this.getSelectedType());
    typeName.valueChanges.pipe(takeUntilDestroyed()).subscribe(typeNameValue => {
      const selectedType = this.data.dataTypes.find(type => type.name === typeNameValue) ?? null;
      this.resetParameterControls(selectedType);
    });
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, isPrimaryKey, isNullable } = this.form.getRawValue();
    const type = this.getSelectedType();

    if (type === null || type.typeId === null) {
      return;
    }

    this.matDialogRef.close({
      ...this.data.field,
      name,
      typeId: type.typeId,
      isPrimaryKey,
      isNullable: isPrimaryKey ? false : isNullable,
      typeParameters: this.form.controls.typeParameters.controls.map(control => ({
        name: control.controls.name.value,
        value: control.controls.value.value,
      })),
    });
  }

  cancel(): void {
    this.matDialogRef.close();
  }

  private getInitialTypeName(): string {
    return this.data.dataTypes.find(type => type.typeId === this.data.field?.typeId)?.name ?? '';
  }

  private getSelectedType(): DataModelDataType | null {
    return this.data.dataTypes.find(type => type.name === this.form.controls.typeName.value) ?? null;
  }

  getPhysicalMappingValue(): string | null {
    const dbSystem = this.contextState.dbSystem();
    const selectedType = this.getSelectedType();

    return selectedType
      ? selectedType.mappings.find(mapping => mapping.dbSystem === dbSystem)?.physicalDataType ?? null
      : null;
  }

  private resetParameterControls(type: DataModelDataType | null): void {
    const parameters = type?.parameters ?? [];
    const shouldReuseValues = type?.typeId === this.data.field?.typeId;
    const existingValues = shouldReuseValues
      ? new Map((this.data.field?.typeParameters ?? []).map(parameter => [parameter.name, parameter.value ?? '']))
      : new Map<string, string>();

    const controls = parameters.map(parameter =>
      this.fb.group({
        name: this.fb.nonNullable.control(parameter.name),
        value: this.fb.nonNullable.control(existingValues.get(parameter.name) ?? '', Validators.required),
      }),
    );

    const array = this.form.controls.typeParameters;
    array.clear();
    controls.forEach(control => array.push(control));
  }
}
