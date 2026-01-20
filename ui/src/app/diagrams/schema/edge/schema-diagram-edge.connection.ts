import { Connection, Element } from 'diagram-js/lib/model/Types';
import { SchemaDiagramEdge } from '../model/schema-diagram-edge.model';

export type SchemaDiagramEdgeType = `edge_${string}`;

export interface SchemaDiagramEdgeConnection extends Connection {
  id: SchemaDiagramEdgeType;
  edge: SchemaDiagramEdge;
  source: Element;
  target: Element;
}

export const isEdgeConnection = (connection: Connection): connection is SchemaDiagramEdgeConnection => {
  return connection.id.startsWith(`edge_`);
};
