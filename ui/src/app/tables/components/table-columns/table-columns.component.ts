import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OracleTypeIconComponent } from '../../../oracle/components/oracle-type-icon/oracle-type-icon.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { TableColumnService } from '../../services/table-column.service';
import { TableConstraintIconComponent } from '../table-constraint-icon/table-constraint-icon.component';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Table } from '../../models/table.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import {
  SetUnusedColumnDialogData,
  TableColumnSetUnusedDialogComponent,
} from './table-column-set-unused-dialog/table-column-set-unused-dialog.component';
import { ProjectService } from '../../../projects/services/project.service';
import { ProjectCollaborationRole } from '../../../projects/models/project-collaboration-role.model';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    OracleTypeIconComponent,
    TranslatePipe,
    TableConstraintIconComponent,
    StatusIconComponent,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuContent,
    MatMenuItem,
  ],
})
export class TableColumnsComponent {
  readonly ALL_COLUMNS = ['icon', 'primary-key', 'name', 'type', 'position', 'nullable', 'actions'];

  projectId = input.required<string>();
  table = inject(ROUTER_OUTLET_DATA) as Signal<Table | null>;
  tableColumns = computed(() => this.table()?.columns ?? []);

  private matDialog = inject(MatDialog);
  private projectService = inject(ProjectService);
  private tableColumnService = inject(TableColumnService);

  primaryKeyColumns = computed(() => {
    const table = this.table();
    const pkColumns = table ? this.tableColumnService.getPrimaryKeyColumns(table) : [];
    return pkColumns.map(column => column.name);
  });

  displayedColumns = computed(() => {
    const primaryKeys = this.primaryKeyColumns();
    const isCollaborator = this.projectService.hasProjectRole(this.projectId(), ProjectCollaborationRole.CONTRIBUTOR)();

    return this.ALL_COLUMNS
      .filter(col => primaryKeys.length > 0 || col !== 'primary-key')
      .filter(col => isCollaborator || col !== 'actions');
  });

  setColumnUnused(columnName: string): void {
    const data: SetUnusedColumnDialogData = { projectId: this.projectId(), tableName: this.table()?.name ?? '', columnName };
    this.matDialog.open(TableColumnSetUnusedDialogComponent, { data });
  }

}
