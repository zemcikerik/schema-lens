import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import type { Connection } from 'diagram-js/lib/model/Types';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { isEdgeConnection, SchemaDiagramEdgeConnection } from './schema-diagram-edge.connection';
import { EDGE_TYPE_ONE_TO_ONE, SchemaDiagramEdge } from '../model/schema-diagram-edge.model';

const EDGE_CLASS = 'schema-diagram__edge';
const EDGE_NON_IDENTIFYING_CLASS = 'non-identifying';
const EDGE_CORNER_RADIUS = 16;

const EDGE_ONE_SIDE_MARKER_CLASS = 'schema-diagram__edge__one-side';
const EDGE_MANY_SIDE_MARKER_CLASS = 'schema-diagram__edge__many-side';

export class SchemaDiagramEdgeRenderer extends BaseRenderer {

  static readonly $inject = ['eventBus'];

  constructor(eventBus: EventBus) {
    super(eventBus, 1500);
  }

  override canRender(connection: Connection): boolean {
    return isEdgeConnection(connection);
  }

  override drawConnection(visuals: SVGElement, connection: SchemaDiagramEdgeConnection): SVGElement {
    const { id, edge } = connection;
    const defs = svgCreate('defs');
    svgAppend(visuals, defs);

    const parentMarkerId = `${id}__parent`;
    const childMarkerId = `${id}__child`;
    this.appendOneSideMarker(defs, parentMarkerId, edge.mandatory);

    if (edge.type === EDGE_TYPE_ONE_TO_ONE) {
      this.appendOneSideMarker(defs, childMarkerId);
    } else {
      this.appendManySideMarker(defs, childMarkerId);
    }

    svgAppend(visuals, createLine(connection.waypoints, {
      class: this.computeEdgeClasses(connection.edge).join(' '),
      markerStart: `url(#${parentMarkerId})`,
      markerEnd: `url(#${childMarkerId})`,
    }, EDGE_CORNER_RADIUS));

    return visuals;
  }

  private appendOneSideMarker(defs: SVGDefsElement, id: string, mandatory = true): void {
    const marker = svgCreate('marker', {
      id,
      class: EDGE_ONE_SIDE_MARKER_CLASS,
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
      class: EDGE_MANY_SIDE_MARKER_CLASS,
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

  private computeEdgeClasses(edge: SchemaDiagramEdge): string[] {
    return edge.identifying ? [EDGE_CLASS] : [EDGE_CLASS, EDGE_NON_IDENTIFYING_CLASS];
  }
}
