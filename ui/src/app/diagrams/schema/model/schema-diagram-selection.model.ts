import { SchemaDiagramNode } from './schema-diagram-node.model';
import { SchemaDiagramEdge } from './schema-diagram-edge.model';

export type SchemaDiagramSelectionTargetType = 'node' | 'edge';

interface BaseSchemaDiagramSelection {
  type: SchemaDiagramSelectionTargetType;
}

export interface SchemaDiagramNodeSelection extends BaseSchemaDiagramSelection {
  type: 'node';
  node: SchemaDiagramNode;
}

export interface SchemaDiagramEdgeSelection extends BaseSchemaDiagramSelection {
  type: 'edge';
  edge: SchemaDiagramEdge;
}

export type SchemaDiagramSelection = SchemaDiagramNodeSelection | SchemaDiagramEdgeSelection;
