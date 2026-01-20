import { SchemaDiagramNode } from './schema-diagram-node.model';
import { SchemaDiagramNodePosition } from './schema-diagram-node-position.model';
import { SchemaDiagramEdge } from './schema-diagram-edge.model';
import { SchemaDiagramEdgePosition } from './schema-diagram-edge.position';

export type SchemaDiagramPatchType = 'node:add' | 'edge:add' | 'layout:auto';

interface BaseSchemaDiagramPatch {
  type: SchemaDiagramPatchType;
}

export interface AddNodePatch extends BaseSchemaDiagramPatch {
  type: 'node:add';
  node: SchemaDiagramNode;
  position?: SchemaDiagramNodePosition;
}

export interface AddEdgePatch extends BaseSchemaDiagramPatch {
  type: 'edge:add';
  edge: SchemaDiagramEdge;
  position?: SchemaDiagramEdgePosition;
}

export interface AutoLayoutPatch extends BaseSchemaDiagramPatch {
  type: 'layout:auto';
}

export type SchemaDiagramPatch = AddNodePatch | AddEdgePatch | AutoLayoutPatch;
