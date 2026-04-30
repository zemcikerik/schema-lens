import { inject, Injectable } from '@angular/core';
import { DataModelerDiagramState } from './data-modeler-diagram.state';
import { DataModelGoToNodeHandler } from '../services/data-model-go-to-node-handler.service';

@Injectable()
export class DataModelerGoToNodeHandler implements DataModelGoToNodeHandler {
  private state = inject(DataModelerDiagramState);

  goToNode(nodeId: number): void {
    this.state.focusNode(nodeId);
  }
}
