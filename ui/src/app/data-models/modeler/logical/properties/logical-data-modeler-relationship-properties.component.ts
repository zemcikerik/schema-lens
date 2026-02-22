import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import {
  SchemaDiagramEdgeSelection,
  SchemaDiagramSelection,
} from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { LogicalModelStore } from '../../../logical-model.store';
import { LogicalDataModelingFacade } from '../logical-data-modeling.facade';
import { LogicalRelationship, LogicalRelationshipType } from '../../../models/logical-model.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineWithPrevious } from '../../../../core/rxjs-pipes';

@Component({
  selector: 'app-logical-data-modeler-relationship-properties',
  templateUrl: './logical-data-modeler-relationship-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
  ],
})
export class LogicalDataModelerRelationshipPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();
  private store = inject(LogicalModelStore);
  private facade = inject(LogicalDataModelingFacade);
  private fb = inject(FormBuilder);

  readonly relationshipTypes: { value: LogicalRelationshipType; label: string }[] = [
    { value: '1:1', label: '1:1 (One to One)' },
    { value: '1:N', label: '1:N (One to Many)' },
  ];

  propertiesForm = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<LogicalRelationshipType>('1:N', [Validators.required]),
    isMandatory: this.fb.nonNullable.control<boolean>(false),
    isIdentifying: this.fb.nonNullable.control<boolean>(false),
  });

  private formModified = false;

  currentRelationship = computed(() => {
    const { edge } = this.selection() as SchemaDiagramEdgeSelection;
    const relationship = this.store.relationships().find(r => r.relationshipId === edge.id);

    if (!relationship) {
      throw new Error('Relationship couldn\'t be resolved');
    }

    return relationship;
  });

  constructor() {
    combineWithPrevious(toObservable(this.currentRelationship))
      .pipe(takeUntilDestroyed())
      .subscribe(([previous, current]) => {
        if (previous !== undefined && previous !== null && previous.relationshipId !== null) {
          this.saveChanges(previous);
        }
        this.propertiesForm.reset({
          type: current.type,
          isMandatory: current.isMandatory,
          isIdentifying: current.isIdentifying,
        });
        this.formModified = false;
      });

    this.propertiesForm.controls.isIdentifying.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(isIdentifying => {
        const mandatory = this.propertiesForm.controls.isMandatory;
        if (isIdentifying) {
          mandatory.setValue(true, { emitEvent: false });
          mandatory.disable({ emitEvent: false });
        } else {
          mandatory.enable({ emitEvent: false });
        }
      });

    this.propertiesForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.formModified = true));
  }

  saveChanges(relationship: LogicalRelationship = this.currentRelationship()): void {
    if (!this.formModified) {
      return;
    }

    const { type, isMandatory, isIdentifying } = this.propertiesForm.getRawValue();
    const updated: LogicalRelationship = { ...relationship, type, isMandatory, isIdentifying };
    this.facade.updateRelationship(updated);
    this.formModified = false;
  }
}
