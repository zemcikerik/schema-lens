import type { ModuleDeclaration } from 'didi';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ElementLike } from 'diagram-js/lib/model/Types';
import { isEntityElement } from '../shapes/entity.shape';

export class EntityMoveHandler {

  static readonly $inject = ['canvas', 'eventBus'];

  constructor(canvas: Canvas, eventBus: EventBus) {
    // prevent entity from being a parent (fixes entity nested in itself error)
    eventBus.on('shape.move.move', (event: { hover: ElementLike | null, hoverGfx: SVGElement | null }) => {
      const hover = event.hover;

      if (hover && isEntityElement(hover) && hover.parent) {
        const graphics = canvas.getGraphics(hover.parent.id);
        event.hover = hover.parent;
        event.hoverGfx = graphics;
      }
    });
  }

}

export default {
  __init__: ['entityMoveHandler'],
  entityMoveHandler: ['type', EntityMoveHandler],
} satisfies ModuleDeclaration;
