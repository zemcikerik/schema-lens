import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import {
  SchemaDiagramNodeSelection,
  SchemaDiagramSelection,
} from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatGenericValidationErrorsPipe } from '../../../../shared/pipes/format-generic-validation-errors.pipe';
import { DataModelStore } from '../../../data-model.store';
import { LogicalDataModelingFacade } from '../logical-data-modeling.facade';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineWithPrevious } from '../../../../core/rxjs-pipes';
import { DataModelNodeFieldsTableComponent } from '../../../components/data-model-node-fields-table/data-model-node-fields-table.component';
import { ResolvedField } from '../../../models/resolved-field.model';

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
    DataModelNodeFieldsTableComponent,
    MatIconButton,
    MatIcon,
    MatTooltip,
  ],
})
export class LogicalDataModelerEntityPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();
  private store = inject(DataModelStore);
  private facade = inject(LogicalDataModelingFacade);

  currentEntity = computed(() => {
    const { node } = this.selection() as SchemaDiagramNodeSelection;
    const entity = this.store.nodes().find(e => e.nodeId === node.id);

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

  private pendingAttributeOrder: ResolvedField[] | null = null;

  constructor() {
    combineWithPrevious(toObservable(this.currentEntity))
      .pipe(takeUntilDestroyed())
      .subscribe(([previous, current]) => {
        if (previous !== undefined && previous !== null && previous.nodeId !== null) {
          this.saveChanges(previous.nodeId);
        }
        this.propertiesForm.reset({ name: current.name });
        this.formModified = false;
        this.pendingAttributeOrder = null;
      });

    this.propertiesForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.formModified = true));
  }

  onAddAttribute(): void {
    this.facade.addAttribute(this.currentEntity().nodeId as number);
  }

  onAttributeOrderChanged(reordered: ResolvedField[]): void {
    this.pendingAttributeOrder = reordered;
  }

  onEditAttribute(attribute: ResolvedField): void {
    if (attribute.source !== 'direct') {
      return;
    }
    this.facade.editAttribute(this.currentEntity().nodeId as number, attribute.field);
  }

  onDeleteAttribute(attribute: ResolvedField): void {
    if (attribute.source !== 'direct') {
      return;
    }
    this.facade.deleteAttribute(this.currentEntity().nodeId as number, attribute.field);
  }

  saveChanges(entityId: number = this.currentEntity().nodeId ?? -1): void {
    const pendingOrder = this.pendingAttributeOrder;

    if (this.formModified) {
      const entity = this.store.nodes().find(e => e.nodeId === entityId);
      if (!entity) {
        throw new Error();
      }

      const updated = { nodeId: entity.nodeId, name: this.propertiesForm.getRawValue().name };
      this.facade.updateEntity(updated);
      this.formModified = false;
    }

    if (pendingOrder !== null) {
      this.facade.reorderAttributes(entityId, pendingOrder);
      this.pendingAttributeOrder = null;
    }
  }
}
