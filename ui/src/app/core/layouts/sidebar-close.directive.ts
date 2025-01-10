import { Directive, HostListener, inject } from '@angular/core';
import { SidebarStateService } from './sidebar-state.service';

@Directive({
  selector: '[appSidebarClose]',
  standalone: true,
})
export class SidebarCloseDirective {

  private sidebarState = inject(SidebarStateService);

  @HostListener('click')
  close(): void {
    this.sidebarState.close();
  }

}
