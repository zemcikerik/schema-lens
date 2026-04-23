import { inject, Injectable } from '@angular/core';
import { DialogService } from '../../core/dialog.service';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelerDiagramState } from './data-modeler-diagram.state';
import { DataModelGoToEdgeHandler } from '../services/data-model-go-to-edge-handler.service';

@Injectable()
export class DataModelerGoToEdgeHandler implements DataModelGoToEdgeHandler {
  private state = inject(DataModelerDiagramState);
  private dialogService = inject(DialogService);

  goToEdge(edge: DataModelEdge): void {
    if (!edge.edgeId || !this.state.isEdgeVisible(edge.edgeId)) {
      this.dialogService.openTextDialog(
        'DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.NOT_VISIBLE.TITLE',
        'DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.NOT_VISIBLE.DESCRIPTION',
      );
      return;
    }

    this.state.focusEdge(edge.edgeId);
  }
}
