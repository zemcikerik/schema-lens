import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CheckTableConstraint } from '../../../models/table-constraint.model';
import { TableColumn } from '../../../models/table-column.model';
import { TableConstraintAffectedColumnsComponent } from '../table-constraint-affected-columns/table-constraint-affected-columns.component';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-constraint-check',
  template: `
    <div>
      <span class="table-constraint__label">{{ ('TABLES.CONSTRAINTS.CONDITION_LABEL' | translate)() }} </span>
      <span class="text-code">{{ constraint().condition }}</span>
    </div>
    <app-table-constraint-affected-columns [columns]="affectedColumns()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TableConstraintAffectedColumnsComponent,
    TranslatePipe,
  ],
})
export class TableConstraintCheckComponent {
  constraint = input.required<CheckTableConstraint>();
  affectedColumns = input.required<TableColumn[]>();
}
