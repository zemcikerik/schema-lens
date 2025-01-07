import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from './core/translate/translate.pipe';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { SidebarStateService } from './core/layouts/sidebar-state.service';
import { RouterLink } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

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
      <a class="top-bar__app-name" [routerLink]="homeLink()">{{ ('APP_TITLE' | translate)() }}</a>
      <a class="top-bar__app-name-short" [routerLink]="homeLink()">{{ ('APP_TITLE_SHORT' | translate)() }}</a>
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
    RouterLink,
  ],
})
export class TopBarComponent {
  authService = inject(AuthService);
  sidebarState = inject(SidebarStateService);
  homeLink = computed(() => this.authService.isAuthenticated() ? ['/project'] : ['/login']);

  toggleSidebar(): void {
    if (this.sidebarState.isOpen()) {
      this.sidebarState.close();
    } else {
      this.sidebarState.open();
    }
  }
}
