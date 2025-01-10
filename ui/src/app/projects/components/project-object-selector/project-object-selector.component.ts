import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input, output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { finalize, Observable, of, Subject, switchMap, tap } from 'rxjs';
import {
  isProjectConnectionError,
  ProjectConnectionError,
  ProjectConnectionFailure,
} from '../../models/project-connection-error.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { catchProjectConnectionError } from '../../catch-project-connection-error.fn';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';

@Component({
  selector: 'app-project-object-selector',
  templateUrl: './project-object-selector.component.html',
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
    MatIconButton,
    MatIcon,
    SidebarCloseDirective,
  ],
})
export class ProjectObjectSelectorComponent {
  title = input.required<string>();
  baseRouterLink = input.required<string[]>();
  loadAction = input.required<() => Observable<string[]>>();
  displayError = output<ProjectConnectionError>();
  expansionPanel = viewChild.required(MatExpansionPanel);

  objects = signal<string[] | null>(null);
  loading = signal<boolean>(false);
  error = signal<ProjectConnectionError | null>(null);
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
    effect(onCleanup => {
      const loadAction = this.loadAction();

      const subscription = untracked(() =>
        this.reload$.pipe(
          tap(() => this.loading.set(true)),
          switchMap(() => loadAction().pipe(
            catchProjectConnectionError(err => of(err)),
            finalize(() => untracked(() => this.loading.set(false))),
          )),
        ).subscribe({
          next: result => {
            if (!isProjectConnectionError(result)) {
              this.objects.set(result);
            } else {
              this.error.set(result);
            }
          },
          error: () => this.error.set({ type: ProjectConnectionFailure.UNKNOWN, message: null }),
        }),
      );

      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      this.baseRouterLink(); // mark as dependency

      untracked(() => {
        this.objects.set(null);
        this.error.set(null);
        this.expansionPanel().close();
      });
    });

    effect(() => {
      const error = this.error();

      if (error !== null) {
        untracked(() => this.expansionPanel().close());
      }
    });
  }

  triggerObjectLoadIfNeeded(): void {
    if (!this.loading() && this.objects() === null && this.error() === null) {
      this.reload$.next();
    }
  }
}
