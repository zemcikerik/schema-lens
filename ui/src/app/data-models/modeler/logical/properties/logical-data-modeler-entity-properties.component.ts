import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import {
  SchemaDiagramNodeSelection,
  SchemaDiagramSelection,
} from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatGenericValidationErrorsPipe } from '../../../../shared/pipes/format-generic-validation-errors.pipe';
import { LogicalModelStore } from '../logical-model.store';
import { LogicalDataModelingFacade } from '../logical-data-modeling.facade';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineWithPrevious } from '../../../../core/rxjs-pipes';

@Component({
  selector: 'app-logical-data-modeler-entity-properties',
  templateUrl: 'logical-data-modeler-entity-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    FormatGenericValidationErrorsPipe,
  ],
})
export class LogicalDataModelerEntityPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();
  private store = inject(LogicalModelStore);
  private facade = inject(LogicalDataModelingFacade);

  currentEntity = computed(() => {
    const { node } = this.selection() as SchemaDiagramNodeSelection;
    const entity = this.store.entities().find(e => e.entityId === node.id);

    if (!entity) {
      throw new Error('Failed to resolve entity for selected node');
    }

    return entity;
  });

  private formModified = false;
  private fb = inject(FormBuilder);
  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(30)]),
  });

  constructor() {
    combineWithPrevious(toObservable(this.currentEntity))
      .pipe(takeUntilDestroyed())
      .subscribe(([previous, current]) => {
        if (previous !== undefined && previous !== null && previous.entityId !== null) {
          this.saveChanges(previous.entityId);
        }
        this.propertiesForm.reset({ name: current.name });
        this.formModified = false;
      });

    this.propertiesForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.formModified = true));
  }

  saveChanges(entityId: number = this.currentEntity().entityId ?? -1): void {
    if (!this.formModified) {
      return;
    }

    const entity = this.store.entities().find(e => e.entityId === entityId);
    if (!entity) {
      throw new Error();
    }

    const updated = { ...entity, name: this.propertiesForm.getRawValue().name };
    this.formModified = false;
    this.facade.updateEntity(updated);
  }
}
