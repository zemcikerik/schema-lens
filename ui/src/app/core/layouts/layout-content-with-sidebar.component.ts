import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { SidebarStateService } from './sidebar-state.service';
import { HorizontalResizerDirective } from '../directives/horizontal-resizer.directive';
import { SidebarResizeTargetDirective } from './sidebar-resize-target.directive';

@Component({
  selector: 'app-layout-content-with-sidebar',
  template: `
    <div #layoutRoot class="layout-content-with-sidebar" [class.is-open]="sidebarState.isOpen()" [class.reverse]="reverse()">
      <aside
        class="layout-content-with-sidebar__sidebar"
        appSidebarResizeTarget
        [widthCssProperty]="'--layout-sidebar-width'"
        [widthCssPropertyTarget]="layoutRoot"
        #sidebarResizeTarget="sidebarResizeTarget"
      >
        <ng-content select="sidebar" />
      </aside>
      <div
        class="layout-content-with-sidebar__resizer"
        appHorizontalResizer
        [resizerTarget]="sidebarResizeTarget"
        [resizerReverse]="reverse()"
      ></div>
      <div class="layout-content-with-sidebar__content">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HorizontalResizerDirective, SidebarResizeTargetDirective],
})
export class LayoutContentWithSidebarComponent implements OnInit, OnDestroy {
  reverse = input<boolean>(false);
  sidebarState = inject(SidebarStateService);

  ngOnInit(): void {
    this.sidebarState.registerSidebar();
  }

  ngOnDestroy(): void {
    this.sidebarState.unregisterSidebar();
  }
}
