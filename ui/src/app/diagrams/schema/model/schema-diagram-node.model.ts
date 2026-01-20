import { SchemaDiagramField } from './schema-diagram-field.model';
import { SchemaDiagramEdge } from './schema-diagram-edge.model';

export interface SchemaDiagramNode {
  id: number;
  name: string;
  fields: SchemaDiagramField[];
  uniqueFieldGroups: string[][];
  parentEdges: SchemaDiagramEdge[];
}
