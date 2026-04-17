import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DataModelEditorSimpleHostComponent } from '../data-model-editor/data-model-editor-simple-host.component';
import { DataModelNodeEditorComponent } from '../data-model-node-editor/data-model-node-editor.component';
import { DataModelNode } from '../../models/data-model-node.model';
import { DataModelStore } from '../../data-model.store';
import { DataModelEditorSimpleHostConfig } from '../data-model-editor/data-model-editor-simple-host.config';
import { DataModelDialogService } from '../../services/data-model-dialog.service';

@Component({
  selector: 'app-data-model-node',
  template: '<app-data-model-editor-simple-host [config]="EDITOR_CONFIG" [currentRawObjectId]="nodeId()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataModelEditorSimpleHostComponent],
})
export class DataModelNodeComponent {
  nodeId = input.required<string>();

  private store = inject(DataModelStore);
  private dialogService = inject(DataModelDialogService);

  readonly EDITOR_CONFIG: DataModelEditorSimpleHostConfig<DataModelNode, DataModelNodeEditorComponent> = {
    editorComponent: DataModelNodeEditorComponent,
    objectInputPropertyKey: 'node',
    objectResolver: (id: number): DataModelNode | null => this.store.nodes().find(n => n.nodeId === id) ?? null,
    titleKey: 'DATA_MODEL.NODE.$layer.EDIT_TITLE',
    titleParamsResolver: (node: DataModelNode) => ({ name: node.name }),
    deleteConfirmationOpener: () => this.dialogService.openDeleteNodeConfirmationDialog(),
    objectDeleter: (id: number) => this.store.deleteNode(id),
  };
}
