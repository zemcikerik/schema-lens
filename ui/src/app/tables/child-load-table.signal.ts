import { DestroyRef, effect, inject, signal, Signal, untracked } from '@angular/core';
import { Table } from './models/table.model';
import { TableService } from './services/table.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

export const childLoadTableSignal = (
  projectIdSignal: Signal<string>,
  tableNameSignal: Signal<string>,
): Signal<Table | null> => {
  const tableService = inject(TableService);
  const destroyRef = inject(DestroyRef);

  const tableSignal = signal<Table | null>(null);

  effect(onCleanup => {
    const projectId = projectIdSignal();
    const tableName = tableNameSignal();

    const subscription = untracked(() =>
      tableService.getTableDetails(projectId, tableName)
        .pipe(
          catchError(() => of(null)), // swallow error, it will be handled by host
          takeUntilDestroyed(destroyRef),
        )
        .subscribe(table => tableSignal.set(table)),
    );

    onCleanup(() => subscription.unsubscribe());
  });

  return tableSignal.asReadonly();
};