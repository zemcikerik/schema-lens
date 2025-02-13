import type Canvas from 'diagram-js/lib/core/Canvas';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ModuleDeclaration } from 'didi';
import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type { Dimensions, Direction, Rect } from 'diagram-js/lib/util/Types';
import { EntityShape, isEntityElement } from '../shapes/entity.shape';
import { translate } from 'diagram-js/lib/util/SvgTransformUtil';
import AngularElementTrackerModule, { AngularElementTracker } from './angular-element-tracker.module';
import {
  DiagramEmbeddedEntityComponent
} from '../components/diagram-embedded-entity/diagram-embedded-entity.component';
import { ResizerOffset, ResizerOffsets } from '../models/resizer-offsets.model';
import { create as svgCreate, replace as svgReplace } from 'tiny-svg';

interface SelectionChangedEvent extends Event {
  newSelection: ElementLike[];
}

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

const RESIZER_CLASS_PREFIX = 'djs-resizer-';
const RESIZER_VISUAL_CLASS = 'djs-resizer-visual';
const ENTITY_RESIZER_CLASS = 'diagram-entity-relationship__entity__resizer';
const ENTITY_RESIZER_RADIUS = 4;

const RESIZER_OFFSETS_MAPPINGS: Record<Direction, keyof ResizerOffsets> = {
  n: 'top',
  e: 'right',
  s: 'bottom',
  w: 'left',
  nw: 'topLeft',
  ne: 'topRight',
  sw: 'bottomLeft',
  se: 'bottomRight',
};

export class EntityResizeHandler {

  static readonly $inject = ['eventBus', 'canvas', 'angularElementTracker'];

  constructor(
    private readonly eventBus: EventBus,
    private readonly canvas: Canvas,
    private readonly angularElementTracker: AngularElementTracker
  ) {
    this.ensureMinimumDimensions();
    this.liveResizePreview();
    this.applyCustomResizers();
  }

  private ensureMinimumDimensions(): void {
    this.eventBus.on('resize.start', 1500, (event: DraggingResizeStartEvent) => {
      if (isEntityElement(event.shape)) {
        event.context.minDimensions = { ...event.shape.minDimensions };
      }
    });
  }

  private liveResizePreview(): void {
    this.eventBus.on('resize.move', 750, (event: DraggingResizeMoveEvent) => {
      if (isEntityElement(event.shape)) {
        this.updateWrapperRectangle(event.shape, event.context.newBounds);
        event.stopPropagation();
      }
    });

    this.eventBus.on('resize.cancel', (event: DraggingResizeCancelEvent) => {
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

  private applyCustomResizers(): void {
    this.eventBus.on('selection.changed', 250, (event: SelectionChangedEvent) => {
      if (event.newSelection.length !== 1 || !isEntityElement(event.newSelection[0])) {
        return;
      }

      const [entity] = event.newSelection;
      const resizers = this.canvas.getLayer('resizers');
      const resizerOffsets = DiagramEmbeddedEntityComponent.calculateResizerHandleOffsets(entity);

      Object.entries(RESIZER_OFFSETS_MAPPINGS).map(([direction, offsetsKey]) => {
        const resizer = resizers.getElementsByClassName(`${RESIZER_CLASS_PREFIX}${direction}`)[0];

        if (resizer) {
          this.updateEntityResizer(entity, resizer as SVGElement, resizerOffsets[offsetsKey]);
        }
      });
    });
  }

  private updateEntityResizer(entity: EntityShape, resizer: SVGElement, offset: ResizerOffset): void {
    resizer.classList.add(ENTITY_RESIZER_CLASS);
    translate(resizer, entity.x + offset.x, entity.y + offset.y);

    const originalVisual = resizer.getElementsByClassName(RESIZER_VISUAL_CLASS)[0];

    if (!originalVisual) {
      return;
    }

    const visual = svgCreate('circle', {
      class: RESIZER_VISUAL_CLASS,
      x: originalVisual.getAttribute('x'),
      y: originalVisual.getAttribute('y'),
      r: ENTITY_RESIZER_RADIUS,
    });
    svgReplace(originalVisual, visual);
  }

}

export default {
  __depends__: [AngularElementTrackerModule],
  __init__: ['entityResizeHandler'],
  entityResizeHandler: ['type', EntityResizeHandler],
} satisfies ModuleDeclaration;
