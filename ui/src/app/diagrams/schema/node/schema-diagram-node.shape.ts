import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type { Dimensions } from 'diagram-js/lib/util/Types';

export type SchemaDiagramNodeShapeType = `node_${string}`;

export interface SchemaDiagramNodeShape extends Shape {
  id: SchemaDiagramNodeShapeType;
  minDimensions: Dimensions;
}

export const isNodeElement = (shape: ElementLike): shape is SchemaDiagramNodeShape => {
  return shape.id.startsWith('node_');
};
