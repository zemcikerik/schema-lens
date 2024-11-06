import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { OracleTypeService } from '../../../oracle/oracle-type.service';
import { OracleTypeCategory } from '../../../oracle/oracle-type-category.model';

const ORACLE_CATEGORY_TO_ICON: Partial<Record<OracleTypeCategory, string>> = {
  'character': 'text_snippet',
  'numeric': 'pin',
  'raw': 'raw_on',
};

const DEFAULT_ICON = 'help';

@Component({
  selector: 'app-table-column-icon',
  templateUrl: './table-column-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
  ],
})
export class TableColumnIconComponent {
  type = input.required<string>();

  private oracleTypeService = inject(OracleTypeService);

  private category: Signal<OracleTypeCategory | null> = computed(() =>
    this.oracleTypeService.deduceTypeCategory(this.type()),
  );

  icon = computed(() => {
    const category = this.category();
    return category !== null ? ORACLE_CATEGORY_TO_ICON[category] ?? DEFAULT_ICON : DEFAULT_ICON;
  });
}
