import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import type { Connection } from 'diagram-js/lib/model/Types';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { isRelationshipConnection, RelationshipConnection } from './relationship.connection';

const RELATIONSHIP_CLASS = 'diagram-entity-relationship__relationship';
const RELATIONSHIP_CORNER_RADIUS = 16;

const RELATIONSHIP_ONE_SIDE_MARKER_CLASS = 'diagram-entity-relationship__relationship__one-side';
const RELATIONSHIP_MANY_SIDE_MARKER_CLASS = 'diagram-entity-relationship__relationship__many-side';

export class RelationshipRenderer extends BaseRenderer {

  static readonly $inject = ['eventBus'];

  constructor(eventBus: EventBus) {
    super(eventBus, 1500);
  }

  override canRender(element: Connection): boolean {
    return isRelationshipConnection(element);
  }

  override drawConnection(visuals: SVGElement, connection: RelationshipConnection): SVGElement {
    const defs = svgCreate('defs');
    svgAppend(visuals, defs);

    const parentMarker = this.createOneSideMarker(defs, connection.id);
    const childMarker = connection.relationship.unique ? parentMarker : this.createManySideMarker(defs, connection.id);

    svgAppend(visuals, createLine(connection.waypoints, {
      class: RELATIONSHIP_CLASS,
      markerStart: `url(#${parentMarker.id})`,
      markerEnd: `url(#${childMarker.id})`,
    }, RELATIONSHIP_CORNER_RADIUS));

    return visuals;
  }

  private createOneSideMarker(defs: SVGDefsElement, id: string): SVGMarkerElement {
    const marker = svgCreate('marker', {
      id: `${id}__one-side`,
      class: RELATIONSHIP_ONE_SIDE_MARKER_CLASS,
      orient: 'auto-start-reverse',
      markerWidth: '1',
      markerHeight: '8',
      refX: '8',
      refY: '4',
    });
    svgAppend(marker, svgCreate('line', { y1: '0', y2: '8' }));

    svgAppend(defs, marker);
    return marker;
  }

  private createManySideMarker(defs: SVGDefsElement, id: string): SVGMarkerElement {
    const marker = svgCreate('marker', {
      id: `${id}__many-side`,
      class: RELATIONSHIP_MANY_SIDE_MARKER_CLASS,
      orient: 'auto-start-reverse',
      markerWidth: '8',
      markerHeight: '10',
      refX: '8',
      refY: '5',
    });
    svgAppend(marker, svgCreate('line', { y1: '5', x2: '8', y2: '1' }));
    svgAppend(marker, svgCreate('line', { y1: '5', x2: '8', y2: '9' }));

    svgAppend(defs, marker);
    return marker;
  }

}
