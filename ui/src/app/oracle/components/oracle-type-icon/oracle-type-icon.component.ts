import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { OracleTypeService } from '../../oracle-type.service';
import { OracleTypeCategory } from '../../oracle-type-category.model';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

const CATEGORY_TO_ICON: Record<OracleTypeCategory, string> = {
  'character': 'subject',
  'numeric': 'pin',
  'raw': 'raw_on',
  'datetime': 'calendar_today',
  'large-object': 'package_2',
  'rowid': 'link',
};

const UNKNOWN_ICON = 'help';

@Component({
  selector: 'app-oracle-type-icon',
  template: '<mat-icon [matTooltip]="(categoryLabel() | translate)()">{{ icon() }}</mat-icon>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip,
    TranslatePipe,
  ],
})
export class OracleTypeIconComponent {
  type = input.required<string>();

  private oracleTypeService = inject(OracleTypeService);

  private category: Signal<OracleTypeCategory | null> = computed(() =>
    this.oracleTypeService.deduceTypeCategory(this.type()),
  );

  icon = computed(() => {
    const category = this.category();
    return category !== null ? CATEGORY_TO_ICON[category] ?? UNKNOWN_ICON : UNKNOWN_ICON;
  });

  categoryLabel = computed(() => {
    const category = this.category() ?? 'unknown';
    return `ORACLE.TYPE_CATEGORY_LABELS.${category.toUpperCase()}`;
  });
}
