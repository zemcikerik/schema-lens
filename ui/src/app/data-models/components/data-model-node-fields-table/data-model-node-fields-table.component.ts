import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, output } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterCellDef, MatFooterCell, MatFooterRowDef, MatFooterRow } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataModelNodeFieldResolverService } from '../../services/data-model-node-field-resolver.service';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ResolvedField } from '../../models/resolved-field.model';

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
  ],
})
export class DataModelNodeFieldsTableComponent {
  readonly DISPLAYED_COLUMNS = ['drag', 'name', 'actions'];
  nodeId = input.required<number>();
  orderChanged = output<ResolvedField[]>();
  editField = output<ResolvedField>();
  deleteField = output<ResolvedField>();
  goToEdge = output<ResolvedField>();

  private fieldResolver = inject(DataModelNodeFieldResolverService);
  readonly resolvedFields = linkedSignal(() => this.fieldResolver.resolveFields(this.nodeId())());

  onDrop(event: CdkDragDrop<ResolvedField[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reordered = [...this.resolvedFields()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.resolvedFields.set(reordered);
    this.orderChanged.emit(reordered);
  }
}
