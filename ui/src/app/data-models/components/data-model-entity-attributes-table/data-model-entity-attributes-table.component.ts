import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, output } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterCellDef, MatFooterCell, MatFooterRowDef, MatFooterRow } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LogicalEntityAttributeResolverService } from '../../services/logical-entity-attribute-resolver.service';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ResolvedAttribute } from '../../models/resolved-attribute.model';

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
  orderChanged = output<ResolvedAttribute[]>();
  editAttribute = output<ResolvedAttribute>();
  deleteAttribute = output<ResolvedAttribute>();
  goToRelationship = output<ResolvedAttribute>();

  private attributeResolver = inject(LogicalEntityAttributeResolverService);
  readonly resolvedAttributes = linkedSignal(() => this.attributeResolver.resolveAttributes(this.entityId())());

  onDrop(event: CdkDragDrop<ResolvedAttribute[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const reordered = [...this.resolvedAttributes()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.resolvedAttributes.set(reordered);
    this.orderChanged.emit(reordered);
  }
}
