import { inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { DataModelStore } from '../data-model.store';
import { DataModelContextState } from '../data-model-context.state';

export interface DataModelGoToNodeHandler {
  goToNode(nodeId: number): void;
}

export const GO_TO_NODE_HANDLER = new InjectionToken<DataModelGoToNodeHandler>('GO_TO_NODE_HANDLER');

@Injectable()
export class DefaultDataModelGoToNodeHandler implements DataModelGoToNodeHandler {
  private store = inject(DataModelStore);
  private contextState = inject(DataModelContextState);
  private router = inject(Router);

  goToNode(nodeId: number): void {
    const context = this.contextState.context();
    const segment = context === 'logical' ? 'entity' : 'table';
    void this.router.navigate(['/model', this.store.dataModelId, context, segment, nodeId]);
  }
}
