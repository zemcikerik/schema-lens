import { inject, Injectable, InjectionToken } from '@angular/core';
import { DialogService } from '../../core/dialog.service';
import { DataModelEdge } from '../models/data-model-edge.model';

export interface DataModelGoToEdgeHandler {
  goToEdge(edge: DataModelEdge): void;
}

export const GO_TO_EDGE_HANDLER = new InjectionToken<DataModelGoToEdgeHandler>('GO_TO_EDGE_HANDLER');

@Injectable()
export class UnsupportedDataModelGoToEdgeHandler implements DataModelGoToEdgeHandler {
  private dialogService = inject(DialogService);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  goToEdge(_edge: DataModelEdge): void {
    this.dialogService.openTextDialog(
      'DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.UNSUPPORTED.TITLE',
      'DATA_MODEL.MODELER.DIALOGS.GO_TO_EDGE.UNSUPPORTED.DESCRIPTION',
    );
  }
}
