import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { finalize, Observable, Subject, switchMap, tap } from 'rxjs';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ObjectSelectorComponent, ObjectSelectorEntry } from '../../../shared/components/object-selector/object-selector.component';

@Component({
  selector: 'app-project-object-selector',
  templateUrl: './project-object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ObjectSelectorComponent,
    MatIconButton,
    MatIcon,
  ],
})
export class ProjectObjectSelectorComponent {
  title = input.required<string>();
  baseRouterLink = input.required<string[]>();
  loadAction = input.required<() => Observable<string[]>>();
  displayError = output<unknown>();
  objectSelector = viewChild.required(ObjectSelectorComponent);

  objects = signal<string[] | null>(null);
  loading = signal<boolean>(false);
  error = signal<unknown | null>(null);
  private reload$ = new Subject<void>();

  objectListEntries = computed<ObjectSelectorEntry[] | null>(() => {
    const objects = this.objects();
    if (objects === null) {
      return null;
    }
    const baseRouterLink = this.baseRouterLink();

    return objects.map(object => ({
      id: object,
      label: object,
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
            finalize(() => untracked(() => this.loading.set(false))),
          )),
        ).subscribe({
          next: objects => this.objects.set(objects),
          error: err => this.error.set(err),
        }),
      );

      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      this.baseRouterLink(); // mark as dependency

      untracked(() => {
        this.objects.set(null);
        this.error.set(null);
        this.objectSelector().closePanel();
      });
    });

    effect(() => {
      const error = this.error();

      if (error !== null) {
        untracked(() => this.objectSelector().closePanel());
      }
    });
  }

  triggerObjectLoadIfNeeded(): void {
    if (!this.loading() && this.objects() === null && this.error() === null) {
      this.reload$.next();
    }
  }
}
