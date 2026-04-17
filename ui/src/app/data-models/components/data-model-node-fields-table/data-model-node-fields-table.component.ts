import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterCellDef, MatFooterCell, MatFooterRowDef, MatFooterRow } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ResolvedField } from '../../models/resolved-field.model';
import { DataModelField } from '../../models/data-model-node.model';
import { DataModelEdge } from '../../models/data-model-edge.model';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { DataModelDataTypePipe } from '../../pipes/data-model-data-type.pipe';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';

export interface DirectFieldReference {
  index: number;
  field: DataModelField;
}

@Component({
  selector: 'app-data-model-node-fields-table',
  templateUrl: 'data-model-node-fields-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterCellDef,
    MatFooterCell,
    MatFooterRowDef,
    MatFooterRow,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatMenu,
    MatMenuTrigger,
    MatMenuContent,
    MatMenuItem,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    TranslatePipe,
    StatusIconComponent,
    DataModelDataTypePipe,
    DataModelingTranslatePipe,
  ],
})
export class DataModelNodeFieldsTableComponent {
  fields = input.required<ResolvedField[]>();
  dataTypes = input.required<DataModelDataType[]>();
  compact = input<boolean>(false);
  orderChanged = output<ResolvedField[]>();
  editDirectField = output<DirectFieldReference>();
  deleteDirectField = output<DirectFieldReference>();
  goToEdge = output<DataModelEdge>();

  displayedColumns = computed(() =>
    this.compact() ? ['drag', 'name', 'actions'] : ['drag', 'name', 'type', 'nullable', 'actions'],
  );

  onDrop(event: CdkDragDrop<ResolvedField[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reordered = [...this.fields()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.orderChanged.emit(reordered);
  }
}
