import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableColumn } from '../../../models/table-column.model';
import { OracleTypeIconComponent } from '../../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-constraint-affected-columns',
  templateUrl: './table-constraint-affected-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OracleTypeIconComponent, TranslatePipe],
})
export class TableConstraintAffectedColumnsComponent {
  columns = input.required<TableColumn[]>();
}
