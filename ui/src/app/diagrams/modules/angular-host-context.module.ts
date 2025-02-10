import { ModuleDeclaration } from 'didi';
import { NgZone, ViewContainerRef } from '@angular/core';

export default class AngularHostContextModuleFactory {

  static create({ ngZone, viewContainerRef }: {
    ngZone: NgZone,
    viewContainerRef: ViewContainerRef,
  }): ModuleDeclaration {
    return {
      __init__: [],
      ngZone: ['value', ngZone],
      viewContainerRef: ['value', viewContainerRef],
    };
  }

}
