import { inject, Injectable } from '@angular/core';
import { DataModelingFacade } from '../data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { defer, delay, Observable, of, tap } from 'rxjs';
import { SchemaDiagramPositionSnapshot } from '../../../diagrams/schema/model/schema-diagram-position-snapshot.model';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';

// TODO: subscription lifetimes

@Injectable()
export class LogicalDataModelingFacade implements DataModelingFacade {
  private state = inject(LogicalDataModelingState);
  private logicalDialogService = inject(LogicalDataModelerDialogService);

  readonly patches$ = this.state.patches$.asObservable();
  readonly loading = this.state.loading.asReadonly();

  connect(from: SchemaDiagramNode, to: SchemaDiagramNode): void {
    this.state.loading.set(true);

    setTimeout(() => {
      this.state.patches$.next({
        type: 'edge:add',
        edge: {
          id: Math.floor(100000 * Math.random()),
          type: '1:N',
          fromNode: from.id,
          toNode: to.id,
          identifying: false,
          mandatory: false,
          references: [],
        },
      });

      this.state.loading.set(false);
    }, 5000);
  }

  deleteNode(nodeId: number): void {
    this.logicalDialogService.openDeleteEntityConfirmation().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.state.loading.set(true);

      setTimeout(() => {
        this.state.patches$.next({ type: 'node:remove', nodeId });
        this.state.loading.set(false);
      }, 1500);
    });
  }

  deleteEdge(edgeId: number): void {
    this.logicalDialogService.openDeleteRelationshipConfirmation().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.state.loading.set(true);

      setTimeout(() => {
        this.state.patches$.next({ type: 'edge:remove', edgeId });
        this.state.loading.set(false);
      }, 1500);
    });
  }

  savePositions(positions: SchemaDiagramPositionSnapshot): Observable<unknown> {
    return defer(() => {
      this.state.loading.set(true);
      return of(null);
    }).pipe(delay(1500), tap(() => console.log(positions)), tap(() => this.state.loading.set(false)));
  }
}
