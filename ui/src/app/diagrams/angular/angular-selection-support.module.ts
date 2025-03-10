import type EventBus from 'diagram-js/lib/core/EventBus';
import type { NgZone } from '@angular/core';
import type { ModuleDeclaration } from 'didi';
import type { ElementLike } from 'diagram-js/lib/model/Types';

interface SelectionChanged {
  oldSelection: ElementLike[];
  newSelection: ElementLike[];
}

export abstract class AngularSelectionSupport {

  static readonly $inject = ['eventBus', 'ngZone'];

  constructor(eventBus: EventBus, ngZone: NgZone) {
    eventBus.on('selection.changed', (event: SelectionChanged) =>
      ngZone.run(() => this.invokeOnSelectionChanged(event))
    );
  }

  abstract invokeOnSelectionChanged(event: SelectionChanged): void;

}

export class AngularSelectionSupportModuleFactory {

  static create({ selectionChange }: {
    selectionChange: (oldSelection: ElementLike[], newSelection: ElementLike[]) => void,
  }): ModuleDeclaration {
    return {
      __init__: ['angularSelectionSupport'],
      angularSelectionSupport: ['type', class extends AngularSelectionSupport {
        override invokeOnSelectionChanged = ({ oldSelection, newSelection }: SelectionChanged) =>
          selectionChange(oldSelection, newSelection);
      }],
    };
  }

}
