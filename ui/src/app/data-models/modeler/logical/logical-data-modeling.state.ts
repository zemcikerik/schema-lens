import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { SchemaDiagramPatch } from '../../../diagrams/schema/model/schema-diagram-patches.model';

@Injectable()
export class LogicalDataModelingState {
  readonly patches$ = new Subject<SchemaDiagramPatch>();
  readonly loading = signal<boolean>(false);
}
