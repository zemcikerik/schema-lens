import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from './core/translate/translate.pipe';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { SidebarStateService } from './core/layouts/sidebar-state.service';

@Component({
  selector: 'app-top-bar',
  template: `
    <mat-toolbar class="top-bar">
      @if (sidebarState.hasSidebar()) {
        <div class="top-bar__sidebar-toggle__wrapper">
          <button mat-icon-button (click)="toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>          
        </div>
      }
      <span>{{ ('APP_TITLE' | translate)() }}</span>
      <div class="top-bar__separator"></div>
      <ng-content />
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbar,
    TranslatePipe,
    MatIcon,
    MatIconButton,
  ],
})
export class TopBarComponent {
  sidebarState = inject(SidebarStateService);

  toggleSidebar(): void {
    if (this.sidebarState.isOpen()) {
      this.sidebarState.close();
    } else {
      this.sidebarState.open();
    }
  }
}
