import type EventBus from 'diagram-js/lib/core/EventBus';
import type Selection from 'diagram-js/lib/features/selection/Selection';
import type { ModuleDeclaration } from 'didi';

const LOW_PRIORITY = 1;

export class NoMultiSelectHandler {

  static readonly $inject = ['eventBus', 'selection'];

  constructor(eventBus: EventBus, selection: Selection) {
    eventBus.on('selection.changed', LOW_PRIORITY, ({ newSelection }: { newSelection: unknown[] }) => {
      if (newSelection.length > 1) {
        selection.select([]);
      }
    });
  }

}

export const NoMultiSelectModule = {
  __init__: ['noMultiSelect'],
  noMultiSelect: ['type', NoMultiSelectHandler],
} satisfies ModuleDeclaration;
