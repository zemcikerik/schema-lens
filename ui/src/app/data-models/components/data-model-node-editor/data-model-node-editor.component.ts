import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { DataModelNodeFieldsTableComponent } from '../data-model-node-fields-table/data-model-node-fields-table.component';
import { DataModelField, DataModelNode } from '../../models/data-model-node.model';
import { ResolvedField } from '../../models/resolved-field.model';
import { DataModelEdge } from '../../models/data-model-edge.model';

@Component({
  selector: 'app-data-model-node-editor',
  templateUrl: './data-model-node-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    LayoutHeaderAndContentComponent,
    DataModelNodeFieldsTableComponent,
  ],
})
export class DataModelNodeEditorComponent {
  node = input.required<DataModelNode>();

  private fb = inject(FormBuilder);
  nodeForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', []), // TODO: validators
    fields: this.fb.nonNullable.control<DataModelField[]>([], [])
  });

  constructor() {
    effect(() => {
      const node = this.node();
      this.nodeForm.reset(structuredClone(node));
    });
  }

  orderChanged(fields: ResolvedField[]): void {
  }

  editDirectField(field: DataModelField): void {
  }

  deleteDirectField(field: DataModelField): void {
  }

  onGoToEdge(edge: DataModelEdge): void {
  }
}
