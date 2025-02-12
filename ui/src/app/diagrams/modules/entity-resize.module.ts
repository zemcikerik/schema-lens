import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ModuleDeclaration } from 'didi';
import type { Shape } from 'diagram-js/lib/model/Types';
import { isEntityElement } from '../shapes/entity.shape';

export class EntityResizeHandler {

  static readonly $inject = ['eventBus'];

  constructor(eventBus: EventBus) {
    eventBus.on('resize.start', 1500, (event: Record<string, unknown>) => {
      const shape = event['shape'] as Shape;
      const context = event['context'] as Record<string, unknown>;

      if (isEntityElement(shape)) {
        context['minDimensions'] = { ...shape.minDimensions };
      }
    });
  }

}

export default {
  __init__: ['entityResizeHandler'],
  entityResizeHandler: ['type', EntityResizeHandler],
} satisfies ModuleDeclaration;
