import type { ConnectionLike, ElementLike } from 'diagram-js/lib/model/Types';
import EventBus from 'diagram-js/lib/core/EventBus';
import Bendpoints from 'diagram-js/lib/features/bendpoints/Bendpoints';
import { remove as svgRemove } from 'tiny-svg';
import type { Injector, ModuleDeclaration } from 'didi';
import { isConnection } from 'diagram-js/lib/util/ModelUtil';
import ConnectionSegmentMove from 'diagram-js/lib/features/bendpoints/ConnectionSegmentMove';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type Dragging from 'diagram-js/lib/features/dragging/Dragging';
import type GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory';
import type Modeling from 'diagram-js/lib/features/modeling/Modeling';
import BendpointMove from 'diagram-js/lib/features/bendpoints/BendpointMove';
import { getConnectionIntersection } from 'diagram-js/lib/features/bendpoints/BendpointUtil';

const HIGH_PRIORITY = 5000;
const LOW_PRIORITY = 100;
const APPLY_START_END_SEGMENT_FIX_KEY = 'applyStartEndSegmentFix';

export class BendpointsStartEndSegmentFixHandler {

  static readonly $inject = ['eventBus', 'bendpoints'];

  constructor(private eventBus: EventBus, private bendpoints: Bendpoints) {
    this.wrapBendpointAddSegmentDraggersCall('element.marker.update');
    this.wrapBendpointAddSegmentDraggersCall('selection.changed');
    this.wrapBendpointAddSegmentDraggersCall('element.hover');

    eventBus.on('connection.changed', (event: { element: ConnectionLike }) => {
      this.removeStartEndSegmentDraggers(event.element);
    });
  }

  private wrapBendpointAddSegmentDraggersCall(eventName: string): void {
    type InterceptedEvent = Record<string, unknown> & { element: ElementLike };

    this.eventBus.on(eventName, HIGH_PRIORITY, (event: InterceptedEvent) => {
      if (!isConnection(event.element)) {
        return;
      }

      const connection = event.element as ConnectionLike;
      event[APPLY_START_END_SEGMENT_FIX_KEY] = !this.bendpoints.getBendpointsContainer(connection, false);
    });

    this.eventBus.on(eventName, LOW_PRIORITY, (event: InterceptedEvent) => {
      if (!event[APPLY_START_END_SEGMENT_FIX_KEY]) {
        return;
      }

      const connection = event.element as ConnectionLike;
      this.removeStartEndSegmentDraggers(connection);
    });
  }

  private removeStartEndSegmentDraggers(connection: ConnectionLike) {
    const graphics = this.bendpoints.getBendpointsContainer(connection, false);

    if (graphics) {
      this.removeSegmentDraggerWithIndex(graphics, 1);
      this.removeSegmentDraggerWithIndex(graphics, connection.waypoints.length - 1);
    }
  }

  private removeSegmentDraggerWithIndex(graphics: HTMLElement, index: number) {
    const dragger = this.bendpoints.getSegmentDragger(index, graphics);

    if (dragger) {
      svgRemove(dragger);
    }
  }

}

export class ConnectionSegmentMoveFixedForStartEnd extends ConnectionSegmentMove {

  static override readonly $inject = [
    'injector',
    'eventBus',
    'canvas',
    'dragging',
    'graphicsFactory',
    'modeling',
    'bendpointMove'
  ];

  constructor(
    injector: Injector,
    eventBus: EventBus,
    canvas: Canvas,
    dragging: Dragging,
    graphicsFactory: GraphicsFactory,
    modeling: Modeling,
    bendpointMove: BendpointMove,
  ) {
    // HACK: due to a mistake in diagram-js typing we need to pass dragging handler typed as canvas
    const retypedDragging = dragging as unknown as Canvas;
    super(injector, eventBus, canvas, retypedDragging, graphicsFactory, modeling);

    const originalStart = this.start;

    this.start = (event: unknown, connection: ConnectionLike, index: number) => {
      if ([1, connection.waypoints.length - 1].includes(index)) {
        const intersection = getConnectionIntersection(canvas, connection.waypoints, event);
        bendpointMove.start(event, connection, intersection.index, !intersection.bendpoint);
      } else {
        originalStart(event, connection, index);
      }
    };
  }

}

export const BendpointsSegmentFixModule = {
  __init__: ['bendpointsSegmentFix'],
  bendpointsSegmentFix: ['type', BendpointsStartEndSegmentFixHandler],
  connectionSegmentMove: ['type', ConnectionSegmentMoveFixedForStartEnd],
} satisfies ModuleDeclaration;
