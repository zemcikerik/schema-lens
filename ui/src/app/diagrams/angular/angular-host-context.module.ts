import { ModuleDeclaration } from 'didi';
import { NgZone, ViewContainerRef } from '@angular/core';

export class AngularHostContextModuleFactory {

  static create({ ngZone, viewContainerRef }: {
    ngZone: NgZone,
    viewContainerRef: ViewContainerRef,
  }): ModuleDeclaration {
    return {
      ngZone: ['value', ngZone],
      viewContainerRef: ['value', viewContainerRef],
    };
  }

}
