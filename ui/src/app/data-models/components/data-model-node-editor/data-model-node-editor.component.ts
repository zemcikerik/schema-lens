import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  DataModelNodeFieldsTableComponent,
  DirectFieldReference,
  EdgeFieldReference,
} from '../data-model-node-fields-table/data-model-node-fields-table.component';
import { DataModelField, DataModelNode } from '../../models/data-model-node.model';
import { EdgeResolvedField, ResolvedField } from '../../models/resolved-field.model';
import { DataModelEdge } from '../../models/data-model-edge.model';
import { applyEdgeFieldModifications, EdgeFieldModification } from '../../models/edge-field-modification.model';
import { DataModelNodeFieldResolver } from '../../services/data-model-node-field.resolver';
import { concatMap, filter, finalize, from, map, mergeMap, Observable, of, reduce, tap } from 'rxjs';
import { DataModelStore } from '../../data-model.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';
import { DataModelEditor } from '../data-model-editor/data-model-editor.component';
import { DataModelModification, mergeDataModelModification } from '../../models/data-model.model';
import { dataModelNodeNameValidators } from '../../validators/data-model-name.validators';
import { GO_TO_EDGE_HANDLER } from '../../services/data-model-go-to-edge-handler.service';

export const DEFAULT_NODE_FIELD_ADD_BUTTON_ID = 'node-editor-add-field-button';

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
export class DataModelNodeEditorComponent implements DataModelEditor {
  node = input.required<DataModelNode>();
  compact = input<boolean>(false);
  addFieldButtonId = input<string>(DEFAULT_NODE_FIELD_ADD_BUTTON_ID);

  nodeId = computed(() => this.node().nodeId ?? -1);

  store = inject(DataModelStore);
  private goToEdgeHandler = inject(GO_TO_EDGE_HANDLER);
  private fieldResolver = inject(DataModelNodeFieldResolver);
  private fb = inject(FormBuilder);
  private modelDialogService = inject(DataModelDialogService);
  private destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', []),
  });
  fields = signal<ResolvedField[]>([]);

  nodeModified = false;
  positionsChanged = false;
  edgeFieldModifications: EdgeFieldModification[] = [];
  pendingSaveId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const node = this.node();
      const existingNames = this.store.nodes()
        .filter(existingNode => existingNode.nodeId !== node.nodeId)
        .map(existingNode => existingNode.name);

      this.form.controls.name.setValidators(dataModelNodeNameValidators(existingNames));
      this.form.controls.name.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      const node = this.node();

      this.form.reset({
        name: node.name,
      });

      this.nodeModified = false;
      this.positionsChanged = false;
      this.edgeFieldModifications = [];
    });

    effect(() => {
      if (this.pendingSaveId() !== null) {
        return;
      }

      const fields = this.fieldResolver.resolveFields(this.nodeId());
      untracked(() => this.fields.set(fields()));
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.nodeModified = true));
  }

  orderChanged(fields: ResolvedField[]): void {
    this.fields.set(fields);
    this.positionsChanged = true;
  }

  addDirectField(): void {
    const existingNames = this.getExistingFieldNames();

    this.modelDialogService
      .openFieldFormDialog(existingNames)
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
    const existingNames = this.getExistingFieldNames(field.name);

    this.modelDialogService
      .openFieldFormDialog(existingNames, field)
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
      .pipe(
        filter(r => !!r),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.fields.update(fields => {
          const result = [...fields];
          result.splice(index, 1);
          return result;
        });

        this.nodeModified = true;
      });
  }

  editEdgeField({ index, field, edge }: EdgeFieldReference): void {
    const existingNames = this.getExistingFieldNames(field.name);

    this.modelDialogService
      .openEdgeFieldFormDialog(existingNames, field)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        if (!updated) {
          return;
        }

        this.fields.update(fields => {
          const result = [...fields];
          result[index] = { ...(result[index] as EdgeResolvedField), field: updated };
          return result;
        });

        const modificationsWithoutCurrentField = this.edgeFieldModifications.filter(
          m => m.edge.edgeId !== edge.edgeId || m.field.referencedFieldId !== field.referencedFieldId
        );

        this.edgeFieldModifications = [...modificationsWithoutCurrentField, { edge, field: updated }];
      });
  }

  goToEdge(edge: DataModelEdge): void {
    this.goToEdgeHandler.goToEdge(edge);
  }

  save(): Observable<DataModelModification> | null {
    if (!this.nodeModified && !this.positionsChanged && !this.edgeFieldModifications.length && this.pendingSaveId() !== null) {
      return null;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const saveNode$ = this.nodeModified
      ? this.saveNodePropertiesWithoutOrder()
      : of({ updatedNodes: [this.node()], updatedEdges: [], deletedNodeIds: [], deletedEdgeIds: [], visuallyStaleNodeIds: [] } satisfies DataModelModification);

    const allFields = this.fields();
    const positionsChanged = this.positionsChanged;
    const edgeFieldModifications = this.edgeFieldModifications;
    this.pendingSaveId.set(this.nodeId());

    return saveNode$.pipe(
      tap(() => (this.nodeModified = false)),
      mergeMap(modification => {
        if (!edgeFieldModifications.length) {
          return of(modification);
        }

        const updatedEdges = applyEdgeFieldModifications(edgeFieldModifications);
        return from(updatedEdges).pipe(
          concatMap(edge => this.store.updateEdge(edge)),
          reduce((acc, mod) => mergeDataModelModification(acc, mod), modification),
          tap(() => (this.edgeFieldModifications = [])),
        );
      }),
      mergeMap(modification => {
        if (!positionsChanged) {
          return of(modification);
        }

        const savedNode = modification.updatedNodes.find(node => node.nodeId === this.pendingSaveId()) as DataModelNode;
        return this.fieldResolver.reorderFields(this.nodeId(), this.updateIdsForNewDirectFields(savedNode, allFields)).pipe(
          map(mod => mergeDataModelModification(modification, mod)),
        );
      }),
      tap(() => (this.positionsChanged = false)),
      finalize(() => this.pendingSaveId.set(null)),
    );
  }

  private saveNodePropertiesWithoutOrder(): Observable<DataModelModification> {
    const { name } = this.form.getRawValue();
    const fields = this.getDirectFields();
    const nodeId = this.nodeId();

    return this.store.updateNode({ nodeId, name, fields });
  }

  private getDirectFields(): DataModelField[] {
    return this.fields()
      .filter(f => f.source === 'direct')
      .map(f => f.field as DataModelField);
  }

  private nextFieldPosition(): number {
    return this.fields().reduce((max, field) => Math.max(max, field.position), 0) + 1;
  }

  private getExistingFieldNames(excludeName?: string): string[] {
    const names = this.fields().map(f => f.field.name);

    return excludeName !== undefined
      ? names.filter(n => n !== excludeName)
      : names;
  }

  private updateIdsForNewDirectFields(node: DataModelNode, allFields: ResolvedField[]): ResolvedField[] {
    const fieldNameToFieldMapping: Record<string, DataModelField> = Object.fromEntries(
      node.fields.map(field => [field.name, field]),
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
