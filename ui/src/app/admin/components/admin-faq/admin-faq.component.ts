import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AdminCreateFaqPost, AdminFaqPost } from '../../models/admin-faq-post.model';
import { AdminHelpService } from '../../services/admin-help.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize, mergeMap, Observable, tap } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AdminFaqTableComponent } from '../admin-faq-table/admin-faq-table.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../../core/translate/translate.service';
import {
  AdminFaqModifyDialogComponent,
  AdminFaqModifyDialogData,
} from '../admin-faq-modify-dialog/admin-faq-modify-dialog.component';
import { MatButton } from '@angular/material/button';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '../../../core/dialog.service';

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
    MatButton,
    MatIcon,
    IconEmphasisDirective,
  ],
})
export class AdminFaqComponent {
  private adminHelpService = inject(AdminHelpService);
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  loading = signal<boolean>(true);
  errorLoad = signal<boolean>(false);
  resultChange = signal<boolean | null>(null);
  faqPosts = signal<AdminFaqPost[]>([]);

  constructor() {
    this.adminHelpService.getFaqPosts().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: posts => this.faqPosts.set(posts),
      error: () => this.errorLoad.set(true),
    });
  }

  create(): void {
    this.openModifyDialog().pipe(
      mergeMap(post => this.adminHelpService.createFaqPost(post)),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: post => {
        this.faqPosts.update(posts => [...posts, post]);
        this.resultChange.set(true);
      },
      error: () => this.resultChange.set(false),
    });
  }

  update(faqPost: AdminFaqPost): void {
    this.openModifyDialog(faqPost).pipe(
      mergeMap(post => this.adminHelpService.updateFaqPost({ ...faqPost, ...post })),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: post => {
        this.faqPosts.update(posts => {
          const postsCopy = [...posts];
          postsCopy[posts.findIndex(p => p.id === post.id)] = post;
          return postsCopy;
        });
        this.resultChange.set(true);
      },
      error: () => this.resultChange.set(false),
    });
  }

  delete(faqPost: AdminFaqPost): void {
    this.dialogService.openConfirmationDialog('ADMIN.FAQ.CONFIRM_DELETE_TITLE', 'ADMIN.FAQ.CONFIRM_DELETE_DESCRIPTION', 'danger').pipe(
      filter(result => !!result),
      tap(() => this.beginModifyOperation()),
      mergeMap(() => this.adminHelpService.deleteFaqPost(faqPost.id)),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => {
        this.faqPosts.update(posts => posts.filter(p => p.id !== faqPost.id));
        this.resultChange.set(true);
      },
      error: () => this.resultChange.set(false),
    });
  }

  private openModifyDialog(faqPost?: AdminFaqPost): Observable<AdminCreateFaqPost> {
    const locales = this.translateService.availableLocales().map(l => l.code);
    const data: AdminFaqModifyDialogData = { locales, faqPost };

    return this.matDialog.open(AdminFaqModifyDialogComponent, { data }).afterClosed().pipe(
      filter(result => result),
      tap(() => this.beginModifyOperation()),
    );
  }

  private beginModifyOperation(): void {
    this.loading.set(true);
    this.resultChange.set(null);
  }
}
