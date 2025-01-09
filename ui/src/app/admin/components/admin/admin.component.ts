import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../../../core/layouts/layout-content-with-sidebar.component';
import { RouterOutlet } from '@angular/router';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutContentWithSidebarComponent,
    RouterOutlet,
    ContentCardComponent,
    AdminNavComponent,
  ],
})
export class AdminComponent {
}
