import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { finalize, Observable, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-object-selector',
  templateUrl: './object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    ProgressSpinnerComponent,
  ],
})
export class ObjectSelectorComponent {
  title = input.required<string>();
  baseRouterLink = input.required<string[]>();
  loadAction = input.required<() => Observable<string[]>>();
  expansionPanel = viewChild.required(MatExpansionPanel);

  objects = signal<string[] | null>(null);
  loading = signal<boolean>(false);
  private reload$ = new Subject<void>();

  objectListEntries = computed(() => {
    const objects = this.objects();
    if (objects === null) {
      return null;
    }
    const baseRouterLink = this.baseRouterLink();

    return objects.map(object => ({
      name: object,
      routerLink: [...baseRouterLink, object],
    }));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(onCleanup => {
      const loadAction = this.loadAction();

      const subscription = untracked(() =>
        this.reload$.pipe(
          tap(() => this.loading.set(true)),
          switchMap(() => loadAction().pipe(
            finalize(() => untracked(() => this.loading.set(false))),
          )),
          takeUntilDestroyed(destroyRef),
        ).subscribe(objects => this.objects.set(objects)),
      );

      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      this.baseRouterLink(); // mark as dependency

      untracked(() => {
        this.objects.set(null);
        this.expansionPanel().close();
      });
    });
  }

  triggerObjectLoadIfNeeded(): void {
    if (!this.loading() && this.objects() === null) {
      this.reload$.next();
    }
  }
}
