import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, untracked, viewChild } from '@angular/core';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export interface ObjectSelectorEntry {
  id: unknown;
  label: string;
  routerLink: (string | number)[];
}

@Component({
  selector: 'app-object-selector',
  templateUrl: './object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    MatListItem,
    MatIconButton,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    SidebarCloseDirective,
    ProgressSpinnerComponent,
  ],
})
export class ObjectSelectorComponent {
  title = input.required<string>();
  loadEntries = input.required<() => Observable<ObjectSelectorEntry[]>>();
  loading = input<boolean>(false);
  displayError = output<unknown>();

  expansionPanel = viewChild.required(MatExpansionPanel);

  entryLoading = signal<boolean>(false);
  effectiveLoading = computed(() => this.loading() || this.entryLoading());

  opened = signal<boolean>(false);
  entries = signal<ObjectSelectorEntry[] | null>(null);
  error = signal<unknown | null>(null);
  private reload$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.opened() && !this.loading() && this.entries() === null && this.error() === null) {
        untracked(() => this.reload$.next());
      }
    });

    toObservable(this.loadEntries)
      .pipe(
        switchMap(loadFn => {
          this.entries.set(null);
          this.error.set(null);
          this.expansionPanel().close();

          return this.reload$.pipe(
            tap(() => this.entryLoading.set(true)),
            switchMap(() => loadFn()),
            tap({
              next: () => this.entryLoading.set(false),
              error: () => this.entryLoading.set(false),
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: entries => this.entries.set(entries),
        error: err => this.error.set(err),
      });

    effect(() => {
      if (this.error() !== null) {
        untracked(() => this.expansionPanel().close());
      }
    });
  }

  onOpened(): void {
    this.opened.set(true);
  }
}
