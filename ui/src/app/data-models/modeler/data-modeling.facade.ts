import { InjectionToken, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SchemaDiagramNode } from '../../diagrams/schema/model/schema-diagram-node.model';
import { SchemaDiagramPatch } from '../../diagrams/schema/model/schema-diagram-patches.model';
import { SchemaDiagramPositionSnapshot } from '../../diagrams/schema/model/schema-diagram-position-snapshot.model';

export const DATA_MODELING_FACADE = new InjectionToken<DataModelingFacade>('DATA_MODELING_FACADE');

export interface DataModelingFacade {
  readonly patches$: Observable<SchemaDiagramPatch>;
  readonly loading: Signal<boolean>;
  readonly diagramName: Signal<string>;
  addExistingNode(): void;
  createNode(): void;
  connect(from: SchemaDiagramNode, to: SchemaDiagramNode): void;
  deleteNode(nodeId: number): void;
  savePositions(positions: SchemaDiagramPositionSnapshot): Observable<unknown>;
}
