import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarStateService } from './sidebar-state.service';

@Component({
  selector: 'app-layout-content-with-sidebar',
  template: `
    <div class="layout-content-with-sidebar" [class.is-open]="sidebarState.isOpen()">
      <aside class="layout-content-with-sidebar__sidebar">
        <ng-content select="sidebar" />
      </aside>
      <div class="layout-content-with-sidebar__content">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutContentWithSidebarComponent implements OnInit, OnDestroy {
  sidebarState = inject(SidebarStateService);

  ngOnInit(): void {
    this.sidebarState.registerSidebar();
  }

  ngOnDestroy(): void {
    this.sidebarState.unregisterSidebar();
  }
}
