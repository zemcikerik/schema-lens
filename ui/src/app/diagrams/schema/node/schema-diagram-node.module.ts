import { AngularElementTrackerModule } from '../../angular/angular-element-tracker.module';
import { ModuleDeclaration } from 'didi';
import { SchemaDiagramNodeMoveHandler } from './schema-diagram-node-move.handler';
import { SchemaDiagramNodeResizeHandler } from './schema-diagram-node-resize.handler';

export const SchemaDiagramNodeModule = {
  __init__: ['nodeMove', 'nodeResize'],
  __depends__: [AngularElementTrackerModule],
  nodeMove: ['type', SchemaDiagramNodeMoveHandler],
  nodeResize: ['type', SchemaDiagramNodeResizeHandler],
} satisfies ModuleDeclaration;
