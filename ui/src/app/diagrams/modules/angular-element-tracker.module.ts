import { ComponentRef } from '@angular/core';
import type { ElementLike } from 'diagram-js/lib/model/Types';
import type { ModuleDeclaration } from 'didi';

const COMPONENT_REF_KEY = 'ng_componentRef';

export class AngularElementTracker {

  attachComponentRef(element: ElementLike, componentRef: ComponentRef<unknown>): void {
    element[COMPONENT_REF_KEY] = componentRef;
  }

  detachComponentRef(element: ElementLike): void {
    delete element[COMPONENT_REF_KEY];
  }

  getComponent<T = unknown>(element: ElementLike): T | null {
    return this.getComponentRef<T>(element)?.instance ?? null;
  }

  getComponentRef<T = unknown>(element: ElementLike): ComponentRef<T> | null {
    return element[COMPONENT_REF_KEY] ?? null;
  }

}

export default {
  __init__: ['angularElementTracker'],
  angularElementTracker: ['type', AngularElementTracker],
} satisfies ModuleDeclaration;
