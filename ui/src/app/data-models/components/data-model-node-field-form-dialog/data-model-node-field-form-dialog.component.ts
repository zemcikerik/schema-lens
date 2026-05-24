import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TranslateService } from '../../../core/translate/translate.service';

export interface DataModelNodeFieldFormDialogData {
  field: DataModelField | null;
  dataTypes: DataModelDataType[];
  existingFieldNames: string[];
}

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
  private translateService = inject(TranslateService);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.field?.name ?? '', dataModelFieldNameValidators(this.data.existingFieldNames)),
    typeName: this.fb.nonNullable.control(this.getInitialTypeName(), [Validators.required]),
    isPrimaryKey: this.fb.nonNullable.control(this.data.field?.isPrimaryKey ?? false),
    isNullable: this.fb.nonNullable.control({
      value: this.data.field?.isNullable ?? true,
      disabled: this.data.field?.isPrimaryKey ?? false,
    }),
    dataTypeParameters: this.fb.array([]),
  });

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

    this.syncParameterControls();

    typeName.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.syncParameterControls());
  }

  get dataTypeParametersArray(): FormArray {
    return this.form.controls.dataTypeParameters as FormArray;
  }

  get dataTypeParameterGroups(): FormGroup[] {
    return this.dataTypeParametersArray.controls as FormGroup[];
  }

  get isPhysicalContext(): boolean {
    return this.contextState.layer() === 'physical';
  }

  get physicalMappingValue(): string {
    if (!this.isPhysicalContext) {
      return '';
    }

    const type = this.getTypeByName(this.form.controls.typeName.value);
    const dbSystem = this.contextState.context();

    if (!type || dbSystem === 'unknown') {
      return this.translateService.translate('DATA_MODEL.DATA_TYPE.NO_MAPPING_LABEL')();
    }

    return (
      type.mappings?.find(mapping => mapping.dbSystem === dbSystem)?.physicalDataType ??
        this.translateService.translate('DATA_MODEL.DATA_TYPE.NO_MAPPING_LABEL')()
    );
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, typeName, isPrimaryKey, isNullable } = this.form.getRawValue();
    const type = this.getTypeByName(typeName);

    if (!type || type.typeId === null) {
      return;
    }

    const dataTypeParameters = this.getParameterValues(type);

    this.matDialogRef.close({
      ...this.data.field,
      name,
      typeId: type.typeId,
      isPrimaryKey,
      isNullable: isPrimaryKey ? false : isNullable,
      dataTypeParameters,
    });
  }

  cancel(): void {
    this.matDialogRef.close(undefined);
  }

  private getInitialTypeName(): string {
    const initial = this.data.dataTypes.find(type => type.typeId === this.data.field?.typeId)?.name;
    return initial ?? '';
  }

  private getTypeByName(name: string): DataModelDataType | undefined {
    return this.data.dataTypes.find(type => type.name === name);
  }

  private syncParameterControls(): void {
    this.resetParameterControls(this.getTypeByName(this.form.controls.typeName.value));
  }

  private resetParameterControls(type: DataModelDataType | undefined): void {
    const parameters = type?.parameters ?? [];
    const shouldReuseValues = type?.typeId === this.data.field?.typeId;
    const existingValues = new Map(
      shouldReuseValues
        ? (this.data.field?.dataTypeParameters ?? []).map(parameter => [parameter.name, parameter.value ?? null])
        : [],
    );

    const controls = parameters.map(parameter =>
      this.fb.group({
        name: this.fb.nonNullable.control(parameter.name),
        value: this.fb.control<number | null>(existingValues.get(parameter.name) ?? null),
      }),
    );

    const array = this.form.controls.dataTypeParameters as FormArray;
    array.clear();
    controls.forEach(control => array.push(control));
  }

  private getParameterValues(type: DataModelDataType): { name: string; value: number | null }[] | null {
    if (!type.parameters?.length) {
      return null;
    }

    return this.dataTypeParametersArray.controls.map(control => ({
      name: control.get('name')?.value as string,
      value: control.get('value')?.value ?? null,
    }));
  }
}

