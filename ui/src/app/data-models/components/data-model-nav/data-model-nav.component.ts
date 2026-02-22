import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { LogicalModelStore } from '../../logical-model.store';
import { DataModelDialogService } from '../../services/data-model-dialog.service';

// TODO: routing

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
  store = inject(LogicalModelStore);
  private dialogService = inject(DataModelDialogService);

  addNewDiagram(): void {
    this.dialogService.openCreateDiagramDialog(this.store.diagrams());
  };

  addNewEntity(): void {
    this.dialogService.openCreateEntityDialog(this.store.entities());
  };

  addNewDataType(): void {
    this.dialogService.openCreateDataTypeDialog(this.store.dataTypes());
  };
}
