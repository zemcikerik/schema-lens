import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatNavList,
    MatListItem,
    RouterLinkActive,
    TranslatePipe,
    RouterLink,
  ],
})
export class AdminNavComponent {
}
