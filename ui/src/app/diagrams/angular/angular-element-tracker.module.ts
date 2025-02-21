import { ComponentRef } from '@angular/core';
import type { ElementLike } from 'diagram-js/lib/model/Types';
import type { ModuleDeclaration } from 'didi';

const COMPONENT_REF_KEY = 'ng_componentRef';
const COMPONENT_WRAPPER_KEY = 'ng_componentWrapper';

export class AngularElementTracker {

  attachComponentRef(element: ElementLike, componentRef: ComponentRef<unknown>): void {
    element[COMPONENT_REF_KEY] = componentRef;
  }

  attachComponentWrapper(element: ElementLike, wrapper: SVGForeignObjectElement): void {
    element[COMPONENT_WRAPPER_KEY] = wrapper;
  }

  detachComponentRef(element: ElementLike): void {
    delete element[COMPONENT_REF_KEY];
  }

  detachComponentWrapper(element: ElementLike): void {
    delete element[COMPONENT_WRAPPER_KEY];
  }

  getComponent<T = unknown>(element: ElementLike): T | null {
    return this.getComponentRef<T>(element)?.instance ?? null;
  }

  getComponentRef<T = unknown>(element: ElementLike): ComponentRef<T> | null {
    return element[COMPONENT_REF_KEY] ?? null;
  }

  getComponentWrapper(element: ElementLike): SVGForeignObjectElement | null {
    return element[COMPONENT_WRAPPER_KEY] ?? null;
  }

}

export const AngularElementTrackerModule = {
  __init__: ['angularElementTracker'],
  angularElementTracker: ['type', AngularElementTracker],
} satisfies ModuleDeclaration;
