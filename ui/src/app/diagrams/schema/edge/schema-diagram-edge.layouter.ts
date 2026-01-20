import BaseLayouter, { LayoutConnectionHints } from 'diagram-js/lib/layout/BaseLayouter';
import { Connection } from 'diagram-js/lib/model/Types';
import { Point } from 'diagram-js/lib/util/Types';
import { getMid } from 'diagram-js/lib/layout/LayoutUtil';
import { isEdgeConnection } from './schema-diagram-edge.connection';

export class SchemaDiagramEdgeLayouter extends BaseLayouter {

  override layoutConnection(connection: Connection, hints?: LayoutConnectionHints): Point[] {
    if (!isEdgeConnection(connection)) {
      return super.layoutConnection(connection, hints);
    }

    const start: Point = hints?.connectionStart || (connection.waypoints?.[0] ?? getMid(connection.source));
    const end: Point = hints?.connectionEnd || (connection.waypoints?.[connection.waypoints.length - 1] ?? getMid(connection.target));

    return [start, ...(connection.waypoints?.slice(1, connection.waypoints.length - 1) ?? []), end];
  }
}
