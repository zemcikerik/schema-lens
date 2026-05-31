import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { DataModelDataType, DataModelDataTypeMapping } from '../../models/data-model-data-type.model';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';
import { DataModelStore } from '../../data-model.store';
import { DataModelContextState } from '../../data-model-context.state';
import { filter, finalize, switchMap, tap, map, startWith } from 'rxjs';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { SaveDeleteControlComponent } from '../../../shared/components/save-delete-control/save-delete-control.component';
import { MatAutocomplete, MatOption, MatAutocompleteTrigger, MatOptgroup } from '@angular/material/autocomplete';
import { DataModelPhysicalDataTypeService } from '../../services/data-model-physical-data-type.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StringListFieldComponent } from '../../../shared/components/string-list-field/string-list-field.component';
import {
  dataModelDataTypeNameValidators,
  dataModelDataTypeParameterValidators,
} from '../../validators/data-model-name.validators';

@Component({
  selector: 'app-data-model-data-type',
  templateUrl: './data-model-data-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInput,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
    LayoutHeaderAndContentComponent,
    AlertComponent,
    MatFormField,
    MatLabel,
    MatError,
    SectionHeaderComponent,
    SaveDeleteControlComponent,
    MatAutocomplete,
    MatOption,
    MatOptgroup,
    MatAutocompleteTrigger,
    StringListFieldComponent,
  ],
})
export class DataModelDataTypeComponent {
  dataTypeId = input.required<string>();
  updateLoading = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  loading = computed<boolean>(() => this.updateLoading() || this.deleteLoading());
  error = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private store = inject(DataModelStore);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private physicalDataTypeService = inject(DataModelPhysicalDataTypeService);
  contextState = inject(DataModelContextState);

  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', []),
    parameters: this.fb.nonNullable.control<string[]>([], dataModelDataTypeParameterValidators()),
    physicalDataType: this.fb.nonNullable.control('', [Validators.maxLength(38)]),
    checkConstraint: this.fb.control(''),
  });

  currentMappings = computed(() => {
    const dbSystem = this.contextState.dbSystem();
    return dbSystem ? (this.dataType()?.mappings.find(mapping => mapping.dbSystem === dbSystem) ?? null) : null;
  });

  filteredPhysicalDataTypes = toSignal(
    this.propertiesForm.valueChanges.pipe(
      map(() => ({ dbSystem: this.contextState.dbSystem(), searchTerm: this.physicalDataTypeControl.value })),
      map(({ dbSystem, searchTerm }) => {
        if (!dbSystem) {
          return [];
        }
        return this.physicalDataTypeService.filterCategorizedPhysicalDataTypes(dbSystem, searchTerm ?? '');
      }),
      startWith([]),
    ),
    { initialValue: [] },
  );

  dataType = computed<DataModelDataType | null>(() => {
    const typeId = +this.dataTypeId();
    return this.store.dataTypes().find(type => type.typeId === typeId) ?? null;
  });

  constructor() {
    effect(() => {
      const dataType = this.dataType();
      const existingNames = this.store
        .dataTypes()
        .filter(existingType => existingType.typeId !== dataType?.typeId)
        .map(existingType => existingType.name);

      this.nameControl.setValidators(dataModelDataTypeNameValidators(existingNames));
      this.nameControl.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      const dataType = this.dataType();

      if (dataType === null) {
        if (!this.loading()) {
          void this.redirectToModel();
        }
        return;
      }

      this.propertiesForm.reset({
        name: dataType.name,
        parameters: dataType.parameters.map(parameter => parameter.name),
        ...untracked(() => this.currentMappings()),
      });
    });

    effect(() => {
      const mapping = this.currentMappings();

      if (mapping !== null) {
        this.propertiesForm.patchValue(mapping, { emitEvent: false });
      }
    });
  }

  updateDataType(): void {
    if (this.propertiesForm.invalid) {
      this.propertiesForm.markAllAsTouched();
      return;
    }

    const typeId = this.dataType()?.typeId;

    if (typeId == null) {
      return;
    }

    const { name, parameters } = this.propertiesForm.getRawValue();
    const updatedDataType: DataModelDataType = {
      typeId,
      name,
      parameters: parameters.map(parameter => ({ name: parameter })),
      mappings: this.applyCurrentFormStateToMappings(),
    };

    this.updateLoading.set(true);
    this.error.set(null);

    this.store
      .updateDataType(updatedDataType)
      .pipe(
        finalize(() => this.updateLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => this.error.set('GENERIC.ERROR_LABEL'),
      });
  }

  deleteDataType(): void {
    const typeId = this.dataType()?.typeId;

    if (typeId == null) {
      return;
    }

    this.dialogService
      .openConfirmationDialog('DATA_MODEL.DATA_TYPE.DELETE_TITLE', 'DATA_MODEL.DATA_TYPE.DELETE_DESCRIPTION', 'danger')
      .pipe(
        filter(result => result === true),
        tap(() => {
          this.deleteLoading.set(true);
          this.error.set(null);
        }),
        switchMap(() => this.store.deleteDataType(typeId)),
        finalize(() => this.deleteLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: async result => {
          if (result === false) {
            this.error.set('DATA_MODEL.DATA_TYPE.IN_USE');
            return;
          }

          await this.redirectToModel();
        },
        error: () => this.error.set('GENERIC.ERROR_LABEL'),
      });
  }

  get nameControl() {
    return this.propertiesForm.controls.name;
  }

  get parametersControl() {
    return this.propertiesForm.controls.parameters;
  }

  get physicalDataTypeControl() {
    return this.propertiesForm.controls.physicalDataType;
  }

  private applyCurrentFormStateToMappings(): DataModelDataTypeMapping[] {
    const currentMappings = this.dataType()?.mappings ?? [];
    const dbSystem = this.contextState.dbSystem();

    if (dbSystem == null) {
      return this.dataType()?.mappings ?? [];
    }

    const { physicalDataType, checkConstraint } = this.propertiesForm.getRawValue();
    const normalizedPhysicalDataType = physicalDataType.trim();

    if (normalizedPhysicalDataType.length === 0) {
      return currentMappings.filter(mapping => mapping.dbSystem !== dbSystem);
    }

    const updatedMapping: DataModelDataTypeMapping = {
      dbSystem,
      physicalDataType: normalizedPhysicalDataType,
      checkConstraint: (checkConstraint?.length ?? 0) > 0 ? checkConstraint : null,
    };
    const existingIndex = currentMappings.findIndex(mapping => mapping.dbSystem === dbSystem);

    return existingIndex !== -1
      ? currentMappings.map((m, i) => (i === existingIndex ? updatedMapping : m))
      : [...currentMappings, updatedMapping];
  }

  private async redirectToModel(): Promise<void> {
    await this.router.navigate(['/model', this.store.dataModelId]);
  }
}
