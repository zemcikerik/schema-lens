import { inject, Injectable } from '@angular/core';
import { DialogService } from '../../core/dialog.service';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelerDiagramState } from './data-modeler-diagram-state.service';
import { DataModelingTranslationKeyResolver } from '../services/data-modeling-translation-key-resolver.service';
import { DataModelGoToEdgeHandler } from '../services/data-model-go-to-edge-handler.service';

@Injectable()
export class DataModelerGoToEdgeHandler implements DataModelGoToEdgeHandler {
  private state = inject(DataModelerDiagramState);
  private dialogService = inject(DialogService);
  private keyResolver = inject(DataModelingTranslationKeyResolver);

  goToEdge(edge: DataModelEdge): void {
    if (!edge.edgeId || !this.state.isEdgeVisible(edge.edgeId)) {
      this.dialogService.openTextDialog(
        this.keyResolver.resolveKey('DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.NOT_VISIBLE.$layer.TITLE'),
        this.keyResolver.resolveKey('DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.NOT_VISIBLE.$layer.DESCRIPTION'),
      );
      return;
    }

    this.state.focusEdge(edge.edgeId);
  }
}
