import type EventBus from 'diagram-js/lib/core/EventBus';
import type ConnectionDocking from 'diagram-js/lib/layout/ConnectionDocking';
import type { Connection } from 'diagram-js/lib/model/Types';
import type { ModuleDeclaration } from 'didi';

interface LayoutConnectionCommandEvent {
  context: { connection: Connection };
}

export class CropWaypointsAfterLayoutHandler {
  static readonly $inject = ['eventBus', 'connectionDocking'];

  constructor(eventBus: EventBus, connectionDocking: ConnectionDocking) {
    eventBus.on('commandStack.connection.layout.postExecute', (event: LayoutConnectionCommandEvent) => {
      const connection = event.context.connection;
      const cropped = connectionDocking.getCroppedWaypoints(connection);
      cropped.forEach(point => delete point.original);
      connection.waypoints = cropped;
    });
  }
}

export const CropWaypointsAfterLayoutModule = {
  __init__: ['cropWaypointsAfterLayout'],
  cropWaypointsAfterLayout: ['type', CropWaypointsAfterLayoutHandler],
} satisfies ModuleDeclaration;
