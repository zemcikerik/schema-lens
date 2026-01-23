import { SchemaDiagramNodePosition } from './schema-diagram-node-position.model';
import { SchemaDiagramEdgePosition } from './schema-diagram-edge.position';

export interface SchemaDiagramPositionSnapshot {
  nodes: Record<number, SchemaDiagramNodePosition>;
  edges: Record<number, SchemaDiagramEdgePosition>;
}
