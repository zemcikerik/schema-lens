import { ModuleDeclaration } from 'didi';
import { SchemaDiagramEdgeRenderer } from './schema-diagram-edge.renderer';
import { SchemaDiagramEdgeLayouter } from './schema-diagram-edge.layouter';
import { SchemaDiagramEdgeConnectionPreview } from './schema-diagram-edge-connection.preview';

export const SchemaDiagramEdgeModule = {
  __init__: ['layouter', 'edgeRenderer', 'edgeConnectionPreview'],
  layouter: ['type', SchemaDiagramEdgeLayouter],
  edgeRenderer: ['type', SchemaDiagramEdgeRenderer],
  edgeConnectionPreview: ['type', SchemaDiagramEdgeConnectionPreview],
} satisfies ModuleDeclaration;
