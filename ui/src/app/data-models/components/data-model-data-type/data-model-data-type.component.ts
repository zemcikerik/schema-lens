import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import {
  DataModelDataType,
  DataModelDataTypeMapping,
  DataModelDataTypeParameter,
  DbSystem,
} from '../../models/data-model-data-type.model';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';
import { DataModelStore } from '../../data-model.store';
import { DataModelContextState } from '../../data-model-context.state';
import { filter, finalize, switchMap, tap, map, startWith } from 'rxjs';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import {
  SaveDeleteControlComponent
} from '../../../shared/components/save-delete-control/save-delete-control.component';
import { MatAutocomplete, MatOption, MatAutocompleteTrigger, MatOptgroup } from '@angular/material/autocomplete';
import { DatabaseTypeService } from '../../services/database-type.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
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
  private databaseTypeService = inject(DatabaseTypeService);
  private contextState = inject(DataModelContextState);

  parameters = signal<DataModelDataTypeParameter[]>([]);
  mappings = signal<DataModelDataTypeMapping[]>([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;

  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(40)]),
    dbSystem: this.fb.nonNullable.control<DbSystem | ''>(''),
    physicalDataType: this.fb.nonNullable.control(''),
    checkConstraint: this.fb.nonNullable.control(''),
  });

  contextDbSystem = computed<DbSystem | ''>(() => (this.contextState.layer() === 'physical' ? 'oracle' : ''));

  selectedMapping = computed(() => {
    const dbSystem = this.contextDbSystem();

    if (!dbSystem) {
      return null;
    }

    return this.mappings().find(mapping => mapping.dbSystem === dbSystem) ?? null;
  });

  filteredPhysicalDataTypes = toSignal(
    this.propertiesForm.valueChanges.pipe(
      map(() => ({ dbSystem: this.dbSystemControl.value, searchTerm: this.physicalDataTypeControl.value })),
      map(({ dbSystem, searchTerm }) => {
        if (!dbSystem || (typeof dbSystem === 'string' && dbSystem.length === 0)) {
          return [];
        }
        return this.databaseTypeService.filterCategorizedPhysicalDataTypes(dbSystem as DbSystem, searchTerm ?? '');
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
      const dbSystem = this.contextDbSystem();

      if (this.dbSystemControl.value !== dbSystem) {
        this.dbSystemControl.setValue(dbSystem);
      }
    });

    effect(() => {
      const dataType = this.dataType();

      if (dataType !== null) {
        this.parameters.set((dataType.parameters ?? []).map(parameter => ({ name: parameter.name })));
        this.mappings.set((dataType.mappings ?? []).map(mapping => ({ ...mapping })));

        this.propertiesForm.reset({
          name: dataType.name,
          dbSystem: this.contextDbSystem(),
          physicalDataType: '',
          checkConstraint: '',
        });

        return;
      }

      if (!this.loading()) {
        this.redirectToModel();
      }
    });

    effect(() => {
      if (!this.contextDbSystem()) {
        return;
      }

      const mapping = this.selectedMapping();

      this.propertiesForm.patchValue(
        {
          physicalDataType: mapping?.physicalDataType ?? '',
          checkConstraint: mapping?.checkConstraint ?? '',
        },
        { emitEvent: false },
      );
    });
  }

  addParameterFromChipInput(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim();

    if (!value || this.parameters().some(parameter => parameter.name === value)) {
      event.chipInput?.clear();
      return;
    }

    this.parameters.update(params => [...params, { name: value }]);
    event.chipInput?.clear();
  }

  editParameter(index: number, event: MatChipEditedEvent): void {
    const value = event.value.trim();

    if (!value) {
      this.removeParameter(index);
      return;
    }

    if (this.parameters().some((parameter, i) => i !== index && parameter.name === value)) {
      return;
    }

    this.parameters.update(params => params.map((parameter, i) => (i === index ? { name: value } : parameter)));
  }

  removeParameter(index: number): void {
    this.parameters.update(params => params.filter((_, i) => i !== index));
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

    this.syncCurrentMappingFromForm();

    const { name } = this.propertiesForm.getRawValue();

    this.updateLoading.set(true);
    this.error.set(null);

    const mappings = this.contextDbSystem()
      ? this.mappings().filter(mapping => mapping.physicalDataType)
      : this.dataType()?.mappings ?? [];

    const updatePayload = {
      typeId,
      name,
      parameters: this.parameters(),
      mappings,
    } as DataModelDataType;

    this.store
      .updateDataType(updatePayload)
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

  get dbSystemControl() {
    return this.propertiesForm.controls.dbSystem;
  }

  get physicalDataTypeControl() {
    return this.propertiesForm.controls.physicalDataType;
  }

  private syncCurrentMappingFromForm(): void {
    const dbSystem = this.contextDbSystem();

    if (!dbSystem) {
      return;
    }

    const { physicalDataType, checkConstraint } = this.propertiesForm.getRawValue();
    const nextMapping: DataModelDataTypeMapping = {
      dbSystem,
      physicalDataType: physicalDataType.length > 0 ? physicalDataType : undefined,
      checkConstraint: checkConstraint.length > 0 ? checkConstraint : undefined,
    };

    this.mappings.update(mappings => {
      const index = mappings.findIndex(mapping => mapping.dbSystem === dbSystem);

      if (index < 0) {
        return [...mappings, nextMapping];
      }

      return mappings.map((mapping, i) => (i === index ? nextMapping : mapping));
    });
  }

  private async redirectToModel(): Promise<void> {
    await this.router.navigate(['/model', this.store.dataModelId]);
  }
}
