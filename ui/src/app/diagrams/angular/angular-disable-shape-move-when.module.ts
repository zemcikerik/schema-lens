import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ModuleDeclaration } from 'didi';
import type { ShapeLike } from 'diagram-js/lib/model/Types';
import { NgZone } from '@angular/core';

const HIGH_PRIORITY = 2000;

export type DisableMoveWhenPredicate = (shapes: ShapeLike[]) => boolean;

export class DisableMoveWhenHandler extends RuleProvider {
  static override readonly $inject = ['eventBus', 'disableMoveWhenPredicate', 'ngZone'];

  constructor(eventBus: EventBus, predicate: DisableMoveWhenPredicate, ngZone: NgZone) {
    super(eventBus);

    this.addRule('elements.move', HIGH_PRIORITY, (context: { shapes: ShapeLike[] }) => {
      return ngZone.run(() => predicate(context.shapes)) ? false : undefined;
    });
  }
}

export class AngularDisableShapeMoveWhenModuleFactory {

  static when(predicate: DisableMoveWhenPredicate): ModuleDeclaration {
    return {
      __init__: ['disableMoveWhen'],
      disableMoveWhen: ['type', DisableMoveWhenHandler],
      disableMoveWhenPredicate: ['value', predicate],
    };
  }
}
