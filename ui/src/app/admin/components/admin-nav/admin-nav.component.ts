import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';

interface AdminNavEntry {
  labelKey: string;
  routerLink: string[];
}

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatNavList,
    MatListItem,
    RouterLinkActive,
    TranslatePipe,
    RouterLink,
    SidebarCloseDirective,
  ],
})
export class AdminNavComponent {
  readonly ENTRIES: AdminNavEntry[] = [
    { labelKey: 'HELP.FAQ_LABEL', routerLink: ['/admin', 'faq'] },
  ];
}
