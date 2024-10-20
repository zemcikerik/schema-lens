import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateService {

  private _isOpen = signal<boolean>(false);
  readonly isOpen = this._isOpen.asReadonly();

  private _hasSidebar = signal<boolean>(false);
  readonly hasSidebar = this._hasSidebar.asReadonly();

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  registerSidebar(): void {
    this._hasSidebar.set(true);
    this._isOpen.set(false);
  }

  unregisterSidebar(): void {
    this._hasSidebar.set(false);
  }

}
