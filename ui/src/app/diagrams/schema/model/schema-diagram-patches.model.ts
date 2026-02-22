import { SchemaDiagramNode } from './schema-diagram-node.model';
import { SchemaDiagramNodePosition } from './schema-diagram-node-position.model';
import { SchemaDiagramEdge } from './schema-diagram-edge.model';
import { SchemaDiagramEdgePosition } from './schema-diagram-edge.position';

export type SchemaDiagramPatchType =
  | 'node:add'
  | 'node:update'
  | 'node:remove'
  | 'edge:add'
  | 'edge:update'
  | 'edge:remove'
  | 'layout:auto'
  | 'diagram:clear';

interface BaseSchemaDiagramPatch {
  type: SchemaDiagramPatchType;
}

export interface AddNodePatch extends BaseSchemaDiagramPatch {
  type: 'node:add';
  node: SchemaDiagramNode;
  position?: SchemaDiagramNodePosition;
}

export interface UpdateNodePatch extends BaseSchemaDiagramPatch {
  type: 'node:update';
  node: SchemaDiagramNode;
}

export interface RemoveNodePatch extends BaseSchemaDiagramPatch {
  type: 'node:remove';
  nodeId: number;
}

export interface AddEdgePatch extends BaseSchemaDiagramPatch {
  type: 'edge:add';
  edge: SchemaDiagramEdge;
  position?: SchemaDiagramEdgePosition;
}

export interface UpdateEdgePatch extends BaseSchemaDiagramPatch {
  type: 'edge:update';
  edge: SchemaDiagramEdge;
}

export interface RemoveEdgePatch extends BaseSchemaDiagramPatch {
  type: 'edge:remove';
  edgeId: number;
}

export interface AutoLayoutPatch extends BaseSchemaDiagramPatch {
  type: 'layout:auto';
}

export interface ClearDiagramPatch extends BaseSchemaDiagramPatch {
  type: 'diagram:clear';
}

export type SchemaDiagramPatch =
  | AddNodePatch
  | UpdateNodePatch
  | RemoveNodePatch
  | AddEdgePatch
  | UpdateEdgePatch
  | RemoveEdgePatch
  | AutoLayoutPatch
  | ClearDiagramPatch;
