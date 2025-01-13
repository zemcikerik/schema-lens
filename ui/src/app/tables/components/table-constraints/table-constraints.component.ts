import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TableConstraintIconComponent } from '../table-constraint-icon/table-constraint-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ConstraintTypeToLabelPipe } from '../../pipes/constraint-type-to-label.pipe';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TableConstraint } from '../../models/table-constraint.model';
import { matExpansionAnimations } from '@angular/material/expansion';
import { TableConstraintComponent } from '../table-constraint/table-constraint.component';
import { childLoadTableSignal } from '../../child-load-table.signal';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-table-constraints',
  templateUrl: './table-constraints.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  ],
  animations: [
    matExpansionAnimations.bodyExpansion,
    matExpansionAnimations.indicatorRotate
  ]
})
export class TableConstraintsComponent {
  readonly DISPLAYED_COLUMNS = ['icon', 'name', 'type', 'enabled', 'expand'];

  projectId = input.required<string>();
  tableName = input.required<string>();

  table = childLoadTableSignal(this.projectId, this.tableName);
  tableColumns = computed(() => this.table()?.columns ?? []);
  tableConstraints = computed(() => this.table()?.constraints ?? []);
  expandedConstraint = signal<TableConstraint | null>(null);

  toggleExpansion(constraint: TableConstraint): void {
    this.expandedConstraint.update(c => c !== constraint ? constraint : null);
  }

  isExpanded(constraint: TableConstraint): boolean {
    return this.expandedConstraint() === constraint;
  }
}
