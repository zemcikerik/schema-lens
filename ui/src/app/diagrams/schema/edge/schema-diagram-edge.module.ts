import { ModuleDeclaration } from 'didi';
import { SchemaDiagramEdgeRenderer } from './schema-diagram-edge.renderer';
import { SchemaDiagramEdgeLayouter } from './schema-diagram-edge.layouter';

export const SchemaDiagramEdgeModule = {
  __init__: ['layouter', 'edgeRenderer'],
  layouter: ['type', SchemaDiagramEdgeLayouter],
  edgeRenderer: ['type', SchemaDiagramEdgeRenderer],
} satisfies ModuleDeclaration;
