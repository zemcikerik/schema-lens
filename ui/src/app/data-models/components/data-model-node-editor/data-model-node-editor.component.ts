import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  DataModelNodeFieldsTableComponent,
  DirectFieldReference,
} from '../data-model-node-fields-table/data-model-node-fields-table.component';
import { DataModelField, DataModelNode } from '../../models/data-model-node.model';
import { ResolvedField } from '../../models/resolved-field.model';
import { DataModelEdge } from '../../models/data-model-edge.model';
import { DataModelNodeFieldResolver } from '../../services/data-model-node-field.resolver';
import { filter, mergeMap, Observable, of } from 'rxjs';
import { DataModelStore } from '../../data-model.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';

@Component({
  selector: 'app-data-model-node-editor',
  templateUrl: './data-model-node-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    DataModelNodeFieldsTableComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    SectionHeaderComponent,
    TranslatePipe,
    DataModelingTranslatePipe,
  ],
})
export class DataModelNodeEditorComponent {
  node = input.required<DataModelNode>();
  compact = input<boolean>(false);
  goToEdge = output<DataModelEdge>();

  nodeId = computed(() => this.node().nodeId ?? -1);

  store = inject(DataModelStore);
  private fieldResolver = inject(DataModelNodeFieldResolver);
  private fb = inject(FormBuilder);
  private modelDialogService = inject(DataModelDialogService);
  private destroyRef = inject(DestroyRef);

  nodeForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', []), // TODO: validators
  });
  fields = linkedSignal(() => this.fieldResolver.resolveFields(this.nodeId())());

  nodeModified = false;
  positionsChanged = false;

  constructor() {
    effect(() => {
      const node = this.node();

      this.nodeForm.reset({
        name: node.name,
      });

      this.nodeModified = false;
    });

    this.nodeForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.nodeModified = true));
  }

  orderChanged(fields: ResolvedField[]): void {
    this.fields.set(fields);
    this.nodeModified = true;
    this.positionsChanged = true;
  }

  addDirectField(): void {
    this.modelDialogService
      .openFieldFormDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(field => {
        if (!field) {
          return;
        }

        const position = this.nextFieldPosition();
        const newField = { ...field, fieldId: null, position };
        this.fields.update(fields => [...fields, { source: 'direct', field: newField, position }]);
        this.nodeModified = true;
      });
  }

  editDirectField({ index, field }: DirectFieldReference): void {
    this.modelDialogService
      .openFieldFormDialog(field)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        if (!updated) {
          return;
        }

        this.fields.update(fields => {
          const result = [...fields];
          result[index] = { source: 'direct', field: updated, position: fields[index].position };
          return result;
        });

        this.nodeModified = true;
      });
  }

  deleteDirectField({ index }: DirectFieldReference): void {
    this.modelDialogService
      .openDeleteFieldConfirmationDialog()
      .pipe(filter(r => !!r), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fields.update(fields => {
          const result = [...fields];
          result.splice(index, 1);
          return result;
        });

        this.nodeModified = true;
      });
  }

  // TODO: return value
  save(): Observable<unknown> | null {
    if (!this.nodeModified) {
      return null;
    }

    if (this.nodeForm.invalid) {
      this.nodeForm.markAllAsTouched();
      return null;
    }

    const { name } = this.nodeForm.getRawValue();
    const allFields = this.fields();
    const fields = this.getDirectFields();
    const positionsChanged = this.positionsChanged;

    return this.store
      .updateNode({ nodeId: this.nodeId(), name, fields })
      .pipe(mergeMap(node => positionsChanged
        ? this.fieldResolver.reorderFields(this.nodeId(), this.updateIdsForNewDirectFields(node, allFields))
        : of(null)
      ));
  }

  private getDirectFields(): DataModelField[] {
    return this.fields()
      .filter(f => f.source === 'direct')
      .map(f => f.field as DataModelField);
  }

  private nextFieldPosition(): number {
    return this.fields().reduce((max, field) => Math.max(max, field.position), 0) + 1;
  }

  // TODO: enforce that field names are unique
  private updateIdsForNewDirectFields(node: DataModelNode, allFields: ResolvedField[]): ResolvedField[] {
    const fieldNameToFieldMapping: Record<string, DataModelField> = Object.fromEntries(
      node.fields.map(field => [field.name, field])
    );

    return allFields.map(resolvedField => {
      if (resolvedField.source === 'edge' || resolvedField.field.fieldId !== null) {
        return resolvedField;
      }

      const { fieldId } = fieldNameToFieldMapping[resolvedField.field.name];
      return { ...resolvedField, field: { ...resolvedField.field, fieldId, position: resolvedField.position } };
    });
  }
}
