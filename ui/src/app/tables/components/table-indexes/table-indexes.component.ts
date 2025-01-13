import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { childLoadTableSignal } from '../../child-load-table.signal';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { TableIndex } from '../../models/table-index.model';
import { matExpansionAnimations } from '@angular/material/expansion';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TableIndexComponent } from '../table-index/table-index.component';
import { TableIndexIconComponent } from '../table-index-icon/table-index-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { IndexTypeToLabelPipe } from '../../pipes/index-type-to-label-pipe';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-table-indexes',
  templateUrl: './table-indexes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    StatusIconComponent,
    MatIconButton,
    MatIcon,
    TableIndexComponent,
    TableIndexIconComponent,
    TranslatePipe,
    IndexTypeToLabelPipe,
    AlertComponent,
  ],
  animations: [
    matExpansionAnimations.bodyExpansion,
    matExpansionAnimations.indicatorRotate
  ],
})
export class TableIndexesComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'name', 'type', 'unique', 'compressed', 'logged', 'expand'];

  projectId = input.required<string>();
  tableName = input.required<string>();

  table = childLoadTableSignal(this.projectId, this.tableName);
  tableIndexes = computed(() => this.table()?.indexes ?? []);
  tableColumns = computed(() => this.table()?.columns ?? []);
  expandedIndex = signal<TableIndex | null>(null);

  toggleExpansion(index: TableIndex): void {
    this.expandedIndex.update(i => i !== index ? index : null);
  }

  isExpanded(index: TableIndex): boolean {
    return this.expandedIndex() === index;
  }
}
