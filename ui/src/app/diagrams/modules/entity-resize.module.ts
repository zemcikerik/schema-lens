import type Canvas from 'diagram-js/lib/core/Canvas';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ModuleDeclaration } from 'didi';
import type { Shape } from 'diagram-js/lib/model/Types';
import type { Dimensions, Rect } from 'diagram-js/lib/util/Types';
import { EntityShape, isEntityElement } from '../shapes/entity.shape';
import { translate } from 'diagram-js/lib/util/SvgTransformUtil';
import AngularElementTrackerModule, { AngularElementTracker } from './angular-element-tracker.module';

interface DraggingResizeStartEvent extends Event {
  shape: Shape;
  context: {
    minDimensions: Dimensions,
  };
}

interface DraggingResizeMoveEvent extends Event {
  shape: Shape;
  context: {
    newBounds: Rect,
  };
}

interface DraggingResizeCancelEvent extends Event {
  shape: Shape;
}

export class EntityResizeHandler {

  static readonly $inject = ['eventBus', 'canvas', 'angularElementTracker'];

  constructor(
    eventBus: EventBus,
    private readonly canvas: Canvas,
    private readonly angularElementTracker: AngularElementTracker
  ) {
    eventBus.on('resize.start', 1500, (event: DraggingResizeStartEvent) => {
      if (isEntityElement(event.shape)) {
        event.context.minDimensions = { ...event.shape.minDimensions };
      }
    });

    eventBus.on('resize.move', 750, (event: DraggingResizeMoveEvent) => {
      if (isEntityElement(event.shape)) {
        this.updateWrapperRectangle(event.shape, event.context.newBounds);
        event.stopPropagation();
      }
    });

    eventBus.on('resize.cancel', (event: DraggingResizeCancelEvent) => {
      if (isEntityElement(event.shape)) {
        this.updateWrapperRectangle(event.shape, event.shape);
      }
    });
  }

  private updateWrapperRectangle(entity: EntityShape, { x, y, width, height }: Rect): void {
    // translate graphics manually to prevent needles redraws
    const graphics = this.canvas.getGraphics(entity);
    translate(graphics, x, y);

    const wrapper = this.angularElementTracker.getComponentWrapper(entity);
    wrapper?.setAttribute('width', String(width));
    wrapper?.setAttribute('height', String(height));
  }

}

export default {
  __depends__: [AngularElementTrackerModule],
  __init__: ['entityResizeHandler'],
  entityResizeHandler: ['type', EntityResizeHandler],
} satisfies ModuleDeclaration;
