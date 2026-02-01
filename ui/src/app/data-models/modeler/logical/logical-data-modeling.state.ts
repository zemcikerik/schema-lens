import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { SchemaDiagramPatch } from '../../../diagrams/schema/model/schema-diagram-patches.model';

@Injectable()
export class LogicalDataModelingState {
  patches$ = new Subject<SchemaDiagramPatch>();
  loading = signal<boolean>(false);

  constructor() {
    setTimeout(() => {
      this.patches$.next({
        type: 'node:add',
        node: {
          id: 1,
          name: 'TEST1',
          fields: [{ name: 'ID', key: true, type: 'ABCD', nullable: false }],
          parentEdges: [],
          uniqueFieldGroups: [],
        },
      });

      this.patches$.next({
        type: 'node:add',
        node: {
          id: 2,
          name: 'TEST2',
          fields: [{ name: 'ID', key: true, type: 'ABCD', nullable: false }],
          parentEdges: [],
          uniqueFieldGroups: [],
        },
      });

      this.patches$.next({ type: 'layout:auto' });
    }, 500);
  }
}
