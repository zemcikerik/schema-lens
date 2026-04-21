import type { ModuleDeclaration } from 'didi';
import EventBus from 'diagram-js/lib/core/EventBus';

export class DebugHandler {

  readonly $inject = ['eventBus'];

  constructor(eventBus: EventBus) {
    const originalFire = eventBus.fire;

    // @ts-expect-error fire is defined with multiple overloads which typescript doesn't handle cleanly with monkey patching
    eventBus.fire = function(...params: Parameters<typeof eventBus.fire>): ReturnType<typeof eventBus.fire> {
      switch (typeof params[0]) {
        case 'string':
          console.log(`${params[0]}:`, ...params.slice(1));
          break;

        case 'object':
          console.log(`${(params[0] as Record<string, unknown>)['type']}:`, ...params);
          break;

        default:
          console.log('undefined:', ...params);
      }

      return originalFire.apply(this, params);
    };
  }
}

export const DebugModule = {
  __init__: ['debugHandler'],
  debugHandler: ['type', DebugHandler],
} satisfies ModuleDeclaration;
