import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import type { Connection } from 'diagram-js/lib/model/Types';
import type { ModuleDeclaration } from 'didi';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend } from 'tiny-svg';

const RELATIONSHIP_CORNER_RADIUS = 4;

export class RelationshipRenderer extends BaseRenderer {

  static readonly $inject = ['eventBus'];

  constructor(eventBus: EventBus) {
    super(eventBus, 1500);
  }

  override canRender(element: Element): boolean {
    return element.id.startsWith('relationship_');
  }

  override drawConnection(visuals: SVGElement, connection: Connection): SVGElement {
    const path = createLine(connection.waypoints, {}, RELATIONSHIP_CORNER_RADIUS);
    path.classList.add('diagram-entity-relationship__relationship');
    svgAppend(visuals, path);
    return visuals;
  }

}

export default {
  __init__: ['relationshipRenderer'],
  relationshipRenderer: ['type', RelationshipRenderer],
} satisfies ModuleDeclaration;
