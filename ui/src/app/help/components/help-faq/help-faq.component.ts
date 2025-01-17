import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { TranslateService } from '../../../core/translate/translate.service';
import { HelpService } from '../../services/help.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FaqPost } from '../../models/faq-post.model';
import { finalize } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { HelpFaqPostsComponent } from '../help-faq-posts/help-faq-posts.component';

@Component({
  selector: 'app-help-faq',
  templateUrl: './help-faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
    AlertComponent,
    HelpFaqPostsComponent,
  ],
})
export class HelpFaqComponent {
  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  faqPosts = signal<FaqPost[]>([]);

  constructor() {
    const locale = inject(TranslateService).locale;
    const helpService = inject(HelpService);
    const destroyRef = inject(DestroyRef);

    effect(onCleanup => {
      const currentLocale = locale();

      const subscription = untracked(() => {
        this.loading.set(true);

        return helpService.getFaqPosts(currentLocale).pipe(
          takeUntilDestroyed(destroyRef),
          finalize(() => untracked(() => this.loading.set(false))),
        ).subscribe({
          next: posts => this.faqPosts.set(posts),
          error: () => this.error.set(true),
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

}

