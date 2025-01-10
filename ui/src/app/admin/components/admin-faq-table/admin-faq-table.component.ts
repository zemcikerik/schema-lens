import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AdminFaqPost } from '../../models/admin-faq-post.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-admin-faq-table',
  templateUrl: './admin-faq-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconButton,
    MatIcon,
    TranslatePipe,
  ],
})
export class AdminFaqTableComponent {
  readonly DISPLAYED_COLUMNS = ['id', 'title', 'locale', 'actions'];

  faqPosts = input.required<AdminFaqPost[]>();
  edit = output<AdminFaqPost>();
  delete = output<AdminFaqPost>();
}
