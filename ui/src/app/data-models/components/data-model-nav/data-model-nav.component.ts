import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import { LogicalDataModel, LogicalEntity } from '../../models/logical-model.model';
import {
  DataTypeCreateDialogComponent,
  DataTypeCreateDialogData,
} from '../data-type-create-dialog/data-type-create-dialog.component';
import { EntityCreateDialogData, EntityCreateDialogComponent } from '../entity-create-dialog/entity-create-dialog.component';
import { DiagramCreateDialogData, DiagramCreateDialogComponent } from '../diagram-create-dialog/diagram-create-dialog.component';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-model-nav',
  templateUrl: './data-model-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    SidebarCloseDirective,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelHeader,
    MatIcon,
    MatIconButton,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    TranslatePipe,
  ],
})
export class DataModelNavComponent {
  dataModelId = input.required<number>();
  logicalModel = input.required<LogicalDataModel | undefined>();

  private matDialog = inject(MatDialog);

  router = inject(Router);

  addNewDiagram = ($event: PointerEvent) => {
    $event?.stopPropagation();
    const data: DiagramCreateDialogData = { modelId: this.dataModelId(), diagrams: this.logicalModel()?.diagrams ?? [] };
    this.matDialog.open(DiagramCreateDialogComponent, { data });
  };

  addNewEntity = ($event: PointerEvent) => {
    $event?.stopPropagation();
    const data: EntityCreateDialogData = { modelId: this.dataModelId(), entities: this.logicalModel()?.entities ?? [] };
    this.matDialog
      .open(EntityCreateDialogComponent, { data })
      .afterClosed()
      .subscribe(async res => {
        if (res) await this.router.navigate(['/model', this.dataModelId(), 'entity', (res as LogicalEntity).entityId]);
      });
  };

  addNewDataType = ($event: PointerEvent) => {
    $event?.stopPropagation();
    const data: DataTypeCreateDialogData = { modelId: this.dataModelId(), dataTypes: this.logicalModel()?.dataTypes ?? [] };
    this.matDialog.open(DataTypeCreateDialogComponent, { data });
  };
}
