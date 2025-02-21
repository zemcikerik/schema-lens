import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type { Dimensions } from 'diagram-js/lib/util/Types';

export interface EntityShape extends Shape {
  id: `entity_${string}`,
  minDimensions: Dimensions;
}

export type EntityShapeTemplate = Pick<EntityShape, 'id' | 'x' | 'y' | 'width' | 'height' | 'minDimensions'>;

export const isEntityElement = (shape: ElementLike): shape is EntityShape => {
  return shape.id.startsWith('entity_');
}
