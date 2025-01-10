import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AdminFaqPost } from '../../models/admin-faq-post.model';
import { AdminHelpService } from '../../services/admin-help.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AdminFaqTableComponent } from '../admin-faq-table/admin-faq-table.component';

@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutHeaderAndContentComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
    AlertComponent,
    AdminFaqTableComponent,
  ],
})
export class AdminFaqComponent {
  private adminHelpService = inject(AdminHelpService);
  private destroyRef = inject(DestroyRef);

  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  faqPosts = signal<AdminFaqPost[]>([]);

  constructor() {
    this.adminHelpService.getFaqPosts().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: posts => this.faqPosts.set(posts),
      error: () => this.error.set(true),
    });
  }
}
