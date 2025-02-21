import { ModuleDeclaration } from 'didi';
import { EntityMoveHandler } from './entity-move.handler';
import { EntityResizeHandler } from './entity-resize.module';
import { AngularElementTrackerModule } from '../../angular/angular-element-tracker.module';

export const EntityModule = {
  __init__: ['entityMove', 'entityResize'],
  __depends__: [AngularElementTrackerModule],
  entityMove: ['type', EntityMoveHandler],
  entityResize: ['type', EntityResizeHandler],
} satisfies ModuleDeclaration;
