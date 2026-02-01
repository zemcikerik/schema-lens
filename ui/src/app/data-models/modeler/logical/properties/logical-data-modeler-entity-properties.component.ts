import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import {
  SchemaDiagramNodeSelection,
  SchemaDiagramSelection,
} from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatGenericValidationErrorsPipe } from '../../../../shared/pipes/format-generic-validation-errors.pipe';
import { LogicalDataModelingState } from '../logical-data-modeling.state';
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
  state = inject(LogicalDataModelingState);

  currentEntity = computed(() => {
    const { node } = this.selection() as SchemaDiagramNodeSelection;
    // TODO: resolve to entity :D
    return { id: node.id, name: node.name };
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
        if (previous !== undefined) {
          this.saveChanges(previous.id);
        }

        this.propertiesForm.reset(current);
        this.formModified = false;
      });

    this.propertiesForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.formModified = true));
  }

  saveChanges(entityId: number = this.currentEntity().id): void {
    if (!this.formModified) {
      return;
    }

    // call update, rerender modeling state
    console.trace(entityId, 'saveChanges');
    this.formModified = false;
  }
}
