import { SchemaDiagramEdgeReference } from './schema-diagram-edge-reference.model';

export const EDGE_TYPE_ONE_TO_ONE = '1:1' as const;
export const EDGE_TYPE_ONE_TO_MANY = '1:N' as const;

export interface SchemaDiagramEdge {
  id: number;
  fromNode: number;
  toNode: number;
  type: typeof EDGE_TYPE_ONE_TO_ONE | typeof EDGE_TYPE_ONE_TO_MANY;
  mandatory: boolean;
  identifying: boolean;
  references: SchemaDiagramEdgeReference[];
}
