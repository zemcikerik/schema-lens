import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DataModelEditorSimpleHostComponent } from '../data-model-editor/data-model-editor-simple-host.component';
import { DataModelEdgeEditorComponent } from '../data-model-edge-editor/data-model-edge-editor.component';
import { DataModelEdge } from '../../models/data-model-edge.model';
import { DataModelStore } from '../../data-model.store';
import { DataModelEditorSimpleHostConfig } from '../data-model-editor/data-model-editor-simple-host.config';
import { DataModelDialogService } from '../../services/data-model-dialog.service';

@Component({
  selector: 'app-data-model-edge',
  template: '<app-data-model-editor-simple-host [config]="EDITOR_CONFIG" [currentRawObjectId]="edgeId()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataModelEditorSimpleHostComponent],
})
export class DataModelEdgeComponent {
  edgeId = input.required<string>();

  private store = inject(DataModelStore);
  private dialogService = inject(DataModelDialogService);

  readonly EDITOR_CONFIG: DataModelEditorSimpleHostConfig<DataModelEdge, DataModelEdgeEditorComponent> = {
    editorComponent: DataModelEdgeEditorComponent,
    objectInputPropertyKey: 'edge',
    objectResolver: (id: number): DataModelEdge | null => this.store.edges().find(e => e.edgeId === id) ?? null,
    titleKey: 'DATA_MODEL.EDGE.EDIT_TITLE',
    titleParamsResolver: (edge: DataModelEdge) => ({ name: `#${edge.edgeId}` }),
    deleteConfirmationOpener: () => this.dialogService.openDeleteEdgeConfirmationDialog(),
    objectDeleter: (id: number) => this.store.deleteEdge(id),
  };
}
