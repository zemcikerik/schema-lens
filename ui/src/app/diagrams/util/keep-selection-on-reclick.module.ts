import type EventBus from 'diagram-js/lib/core/EventBus';
import type Selection from 'diagram-js/lib/features/selection/Selection';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type { ElementLike } from 'diagram-js/lib/model/Types';
import type { ModuleDeclaration } from 'didi';
import { hasSecondaryModifier, isPrimaryButton } from 'diagram-js/lib/util/Mouse';

const HIGH_PRIORITY = 1500;

interface ElementClickEvent extends MouseEvent {
  element: ElementLike;
  stopPropagation(): void;
}

export class KeepSelectionOnReclickHandler {
  static readonly $inject = ['eventBus', 'selection', 'canvas'];

  constructor(eventBus: EventBus, selection: Selection, canvas: Canvas) {
    eventBus.on('element.click', HIGH_PRIORITY, (event: ElementClickEvent) => {
      if (!isPrimaryButton(event) || hasSecondaryModifier(event)) {
        return;
      }

      const element = event.element;
      if (element === canvas.getRootElement()) {
        return;
      }

      const selected = selection.get();
      if (selected.length === 1 && selected[0] === element) {
        event.stopPropagation();
      }
    });
  }
}

export const KeepSelectionOnReclickModule = {
  __init__: ['keepSelectionOnReclick'],
  keepSelectionOnReclick: ['type', KeepSelectionOnReclickHandler],
} satisfies ModuleDeclaration;
