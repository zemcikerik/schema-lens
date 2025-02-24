import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import type { Connection } from 'diagram-js/lib/model/Types';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { isRelationshipConnection, RelationshipConnection } from './relationship.connection';
import { Relationship } from './relationship.model';

const RELATIONSHIP_CLASS = 'diagram-entity-relationship__relationship';
const RELATIONSHIP_NON_IDENTIFYING_CLASS = 'non-identifying';
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
    const { id, relationship } = connection;
    const defs = svgCreate('defs');
    svgAppend(visuals, defs);

    const parentMarkerId = `${id}__parent`;
    const childMarkerId = `${id}__child`;
    this.appendOneSideMarker(defs, parentMarkerId, relationship.mandatory);

    if (relationship.unique) {
      this.appendOneSideMarker(defs, childMarkerId);
    } else {
      this.appendManySideMarker(defs, childMarkerId);
    }

    svgAppend(visuals, createLine(connection.waypoints, {
      class: this.computeRelationshipClasses(connection.relationship).join(' '),
      markerStart: `url(#${parentMarkerId})`,
      markerEnd: `url(#${childMarkerId})`,
    }, RELATIONSHIP_CORNER_RADIUS));

    return visuals;
  }

  private appendOneSideMarker(defs: SVGDefsElement, id: string, mandatory = true): void {
    const marker = svgCreate('marker', {
      id,
      class: RELATIONSHIP_ONE_SIDE_MARKER_CLASS,
      orient: 'auto-start-reverse',
      markerWidth: '8',
      markerHeight: '8',
      refX: '8',
      refY: '4',
    });

    if (!mandatory) {
      svgAppend(marker, svgCreate('circle', { cx: '4', cy: '4', r: '2' }));
    }

    svgAppend(marker, svgCreate('line', { x1: '1', x2: '1', y1: '0', y2: '8' }));
    svgAppend(defs, marker);
  }

  private appendManySideMarker(defs: SVGDefsElement, id: string): void {
    const marker = svgCreate('marker', {
      id,
      class: RELATIONSHIP_MANY_SIDE_MARKER_CLASS,
      orient: 'auto-start-reverse',
      markerWidth: '8',
      markerHeight: '10',
      refX: '8',
      refY: '5',
    });

    svgAppend(marker, svgCreate('line', { y1: '5', x2: '8', y2: '1' }));
    svgAppend(marker, svgCreate('line', { y1: '5', x2: '8', y2: '5' }));
    svgAppend(marker, svgCreate('line', { y1: '5', x2: '8', y2: '9' }));
    svgAppend(defs, marker);
  }

  private computeRelationshipClasses(relationship: Relationship): string[] {
    return relationship.identifying ? [RELATIONSHIP_CLASS] : [RELATIONSHIP_CLASS, RELATIONSHIP_NON_IDENTIFYING_CLASS];
  }

}
