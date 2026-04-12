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
  selector: 'app-data-model-entity-attributes-table',
  templateUrl: 'data-model-entity-attributes-table.component.html',
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
export class DataModelEntityAttributesTableComponent {
  readonly DISPLAYED_COLUMNS = ['drag', 'name', 'actions'];
  entityId = input.required<number>();
  orderChanged = output<ResolvedField[]>();
  editAttribute = output<ResolvedField>();
  deleteAttribute = output<ResolvedField>();
  goToRelationship = output<ResolvedField>();

  private fieldResolver = inject(DataModelNodeFieldResolverService);
  readonly resolvedAttributes = linkedSignal(() => this.fieldResolver.resolveFields(this.entityId())());

  onDrop(event: CdkDragDrop<ResolvedField[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reordered = [...this.resolvedAttributes()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.resolvedAttributes.set(reordered);
    this.orderChanged.emit(reordered);
  }
}
