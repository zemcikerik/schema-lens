import type { ModuleDeclaration } from 'didi';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type { CanvasViewbox } from 'diagram-js/lib/core/Canvas';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';

const LOW_PRIORITY = 100;

const BACKGROUND_LAYER = 'diagram-grid-background';
const BACKGROUND_LAYER_INDEX = -100;
const BACKGROUND_BASE_COORDINATE = -50000;
const BACKGROUND_LENGTH = 100000;

export class GridBackground {

  static readonly $inject = ['eventBus', 'canvas'];
  private background: SVGElement | null = null;
  private visible = false;

  constructor(eventBus: EventBus, private readonly canvas: Canvas) {
    eventBus.on('canvas.init', LOW_PRIORITY, () => {
      const backgroundLayer = canvas.getLayer(BACKGROUND_LAYER, BACKGROUND_LAYER_INDEX);
      this.background = svgCreate('rect', {
        x: BACKGROUND_BASE_COORDINATE, y: BACKGROUND_BASE_COORDINATE,
        width: BACKGROUND_LENGTH, height: BACKGROUND_LENGTH,
        class: 'diagram__grid-background',
        style: `fill: url("#${this.createGridPattern(backgroundLayer)}")`,
      });
      svgAppend(backgroundLayer, this.background);
      this.visible = true;
    });

    eventBus.on('canvas.viewbox.changed', (event: Event & { viewbox: CanvasViewbox }) => {
      this.recenterBackground(event.viewbox);
    });
  }

  private createGridPattern(backgroundLayer: SVGElement): string {
    const randomIdSuffix = (Math.random() + 1).toString(36).substring(7);
    const patternId = `diagram-grid-background-${randomIdSuffix}`;

    const gridPattern = svgCreate('pattern', {
      id: patternId, width: 10, height: 10,
      class: 'diagram__grid-background__pattern', patternUnits: 'userSpaceOnUse',
    });
    svgAppend(gridPattern, svgCreate('circle', {
      cx: 1, cy: 1, r: 1,
    }));

    const defs = svgCreate('defs');
    svgAppend(backgroundLayer, defs);
    svgAppend(defs, gridPattern);

    return patternId;
  }

  private recenterBackground({ x, y }: { x: number, y: number }): void {
    if (this.background !== null) {
      svgAttr(this.background, {
        x: BACKGROUND_BASE_COORDINATE + x,
        y: BACKGROUND_BASE_COORDINATE + y,
      });
    }
  }

  isBackgroundShown(): boolean {
    return this.visible;
  }

  showBackground(): void {
    this.visible = true;
    this.canvas.showLayer(BACKGROUND_LAYER);
  }

  hideBackground(): void {
    this.visible = false;
    this.canvas.hideLayer(BACKGROUND_LAYER);
  }
}

export const GridBackgroundModule = {
  __init__: ['gridBackground'],
  gridBackground: ['type', GridBackground],
} satisfies ModuleDeclaration;
