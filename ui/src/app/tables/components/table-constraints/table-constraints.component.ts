import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TableConstraintIconComponent } from '../table-constraint-icon/table-constraint-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ConstraintTypeToLabelPipe } from '../../pipes/constraint-type-to-label.pipe';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TableConstraint } from '../../models/table-constraint.model';
import { TableConstraintComponent } from '../table-constraint/table-constraint.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-table-constraints',
  templateUrl: './table-constraints.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    TableConstraintIconComponent,
    TranslatePipe,
    ConstraintTypeToLabelPipe,
    StatusIconComponent,
    MatIcon,
    MatIconButton,
    TableConstraintComponent,
    AlertComponent,
    MatTooltip,
  ],
})
export class TableConstraintsComponent {
  readonly ALL_COLUMNS = ['icon', 'invalid', 'name', 'type', 'enabled', 'expand'];

  table = inject(ROUTER_OUTLET_DATA) as Signal<Table | null>;
  tableColumns = computed(() => this.table()?.columns ?? []);
  tableConstraints = computed(() => this.table()?.constraints ?? []);
  expandedConstraint = signal<TableConstraint | null>(null);

  displayedColumns = computed(() => {
    const hasInvalid = this.tableConstraints().some(constraint => constraint.invalid);
    return hasInvalid ? this.ALL_COLUMNS : this.ALL_COLUMNS.filter(col => col !== 'invalid');
  });

  toggleExpansion(constraint: TableConstraint): void {
    this.expandedConstraint.update(c => c !== constraint ? constraint : null);
  }

  isExpanded(constraint: TableConstraint): boolean {
    return this.expandedConstraint() === constraint;
  }
}
