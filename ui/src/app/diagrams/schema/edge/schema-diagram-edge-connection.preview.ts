import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { Connection } from 'diagram-js/lib/model/Types';
import { isEdgeConnection } from './schema-diagram-edge.connection';

export class SchemaDiagramEdgeConnectionPreview extends RuleProvider {

  override init() {
    this.addRule('connection.updateWaypoints', (ctx: { connection: Connection }) => {
      return isEdgeConnection(ctx.connection)
        ? { id: 'edge_preview', edge: ctx.connection.edge }
        : undefined;
    });

    this.addRule('connection.reconnect', (ctx: { connection: Connection }) => {
      return isEdgeConnection(ctx.connection)
        ? { id: 'edge_preview', edge: ctx.connection.edge }
        : undefined;
    });
  }
}
