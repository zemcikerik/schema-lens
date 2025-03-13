import type EventBus from 'diagram-js/lib/core/EventBus';
import type Selection from 'diagram-js/lib/features/selection/Selection';
import type { ModuleDeclaration } from 'didi';

export class UnfocusHandler {

  static readonly $inject = ['eventBus', 'selection'];

  constructor(eventBus: EventBus, selection: Selection) {
    eventBus.on('canvas.focus.changed', ({ focused }: { focused: boolean }) => {
      if (!focused && selection.get().length > 0) {
        selection.select([]);
      }
    });
  }

}

export const UnfocusModule = {
  __init__: ['unfocus'],
  unfocus: ['type', UnfocusHandler],
} satisfies ModuleDeclaration;
