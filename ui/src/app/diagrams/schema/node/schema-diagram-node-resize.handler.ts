import type { ElementLike, Shape } from 'diagram-js/lib/model/Types';
import type { Dimensions, Direction, Rect } from 'diagram-js/lib/util/Types';
import { ResizerOffset, ResizerOffsets } from './resizer-offsets.model';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type Selection from 'diagram-js/lib/features/selection/Selection';
import type { AngularElementTracker } from '../../angular/angular-element-tracker.module';
import { translate } from 'diagram-js/lib/util/SvgTransformUtil';
import { create as svgCreate, replace as svgReplace } from 'tiny-svg';
import { isNodeElement, SchemaDiagramNodeShape } from './schema-diagram-node.shape';
import { SchemaDiagramNodeComponent } from './schema-diagram-node.component';

interface SelectionChangedEvent extends Event {
  newSelection: ElementLike[];
}

interface DraggingResizeStartEvent extends Event {
  shape: Shape;
  context: {
    minDimensions: Dimensions;
  };
}

interface DraggingResizeMoveEvent extends Event {
  shape: Shape;
  context: {
    newBounds: Rect;
  };
}

interface DraggingResizeCancelEvent extends Event {
  shape: Shape;
}

const RESIZER_CLASS_PREFIX = 'djs-resizer-';
const RESIZER_VISUAL_CLASS = 'djs-resizer-visual';
const NODE_RESIZER_RADIUS = 4;

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

export class SchemaDiagramNodeResizeHandler {

  static readonly $inject = ['eventBus', 'canvas', 'selection', 'angularElementTracker'];

  constructor(
    private readonly eventBus: EventBus,
    private readonly canvas: Canvas,
    private readonly selection: Selection,
    private readonly angularElementTracker: AngularElementTracker
  ) {
    this.ensureMinimumDimensions();
    this.liveResizePreview();
    this.applyCustomResizers();
  }

  private ensureMinimumDimensions(): void {
    this.eventBus.on('resize.start', 1500, (event: DraggingResizeStartEvent) => {
      if (isNodeElement(event.shape)) {
        event.context.minDimensions = { ...event.shape.minDimensions };
      }
    });
  }

  private liveResizePreview(): void {
    this.eventBus.on('resize.move', 750, (event: DraggingResizeMoveEvent) => {
      if (isNodeElement(event.shape)) {
        this.updateWrapperRectangle(event.shape, event.context.newBounds);
        event.stopPropagation();
      }
    });

    this.eventBus.on('resize.cancel', (event: DraggingResizeCancelEvent) => {
      if (isNodeElement(event.shape)) {
        this.updateWrapperRectangle(event.shape, event.shape);
      }
    });
  }

  private updateWrapperRectangle(node: SchemaDiagramNodeShape, { x, y, width, height }: Rect): void {
    // translate graphics manually to prevent needles redraws
    const graphics = this.canvas.getGraphics(node);
    translate(graphics, x, y);

    const wrapper = this.angularElementTracker.getComponentWrapper(node);
    wrapper?.setAttribute('width', String(width));
    wrapper?.setAttribute('height', String(height));
  }

  private applyCustomResizers(): void {
    this.eventBus.on('selection.changed', 250, (event: SelectionChangedEvent) => {
      if (event.newSelection.length !== 1 || !isNodeElement(event.newSelection[0])) {
        return;
      }

      this.replaceResizers(event.newSelection[0]);
    });

    this.eventBus.on('shape.changed', 250, ({ element }: { element: Shape }) => {
      if (isNodeElement(element) && this.selection.isSelected(element)) {
        this.replaceResizers(element);
      }
    });
  }

  private replaceResizers(node: SchemaDiagramNodeShape): void {
    const resizers = this.canvas.getLayer('resizers');
    const resizerOffsets = SchemaDiagramNodeComponent.calculateResizerHandleOffsets(node);

    Object.entries(RESIZER_OFFSETS_MAPPINGS).map(([direction, offsetsKey]) => {
      const resizer = resizers.getElementsByClassName(`${RESIZER_CLASS_PREFIX}${direction}`)[0];

      if (resizer) {
        this.updateNodeResizer(node, resizer as SVGElement, resizerOffsets[offsetsKey]);
      }
    });
  }

  private updateNodeResizer(node: SchemaDiagramNodeShape, resizer: SVGElement, offset: ResizerOffset): void {
    translate(resizer, node.x + offset.x, node.y + offset.y);
    const originalVisual = resizer.getElementsByClassName(RESIZER_VISUAL_CLASS)[0];

    if (!originalVisual) {
      return;
    }

    const visual = svgCreate('circle', {
      class: RESIZER_VISUAL_CLASS,
      x: originalVisual.getAttribute('x'),
      y: originalVisual.getAttribute('y'),
      r: NODE_RESIZER_RADIUS,
    });
    svgReplace(originalVisual, visual);
  }
}
