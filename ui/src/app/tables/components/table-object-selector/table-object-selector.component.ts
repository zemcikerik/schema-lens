import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { ObjectSelectorComponent } from '../../../shared/components/object-selector/object-selector.component';
import { delay, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-object-selector',
  template: `
    <app-object-selector
      [title]="('TABLES.LABEL' | translate)()"
      [baseRouterLink]="['/project', projectId(), 'table']"
      [objects]="tables()"
      [loading]="loading()"
      (reloadObjects)="reloadTables()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ObjectSelectorComponent,
    TranslatePipe,
  ],
})
export class TableObjectSelectorComponent {
  projectId = input.required<string>();
  tables = signal<string[] | null>(null);
  loading = signal<boolean>(false);

  private destroyRef = inject(DestroyRef);

  reloadTables(): void {
    this.loading.set(true);

    of(['TEST_TABLE1', 'TEST_TABLE2', 'TEST_TABLE3']).pipe(
      delay(1000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe(tables => this.tables.set(tables));
  }
}
