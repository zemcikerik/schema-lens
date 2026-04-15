import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataModelStore } from '../../data-model.store';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { ObjectSelectorComponent, ObjectSelectorEntry } from '../../../shared/components/object-selector/object-selector.component';
import { DataModelContextSwitcherComponent } from '../data-model-context-switcher/data-model-context-switcher.component';
import { DataModelingContextState } from '../../data-modeling-context.state';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';

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
    MatIcon,
    MatIconButton,
    ObjectSelectorComponent,
    TranslatePipe,
    DataModelContextSwitcherComponent,
    DataModelingTranslatePipe,
  ],
})
export class DataModelNavComponent {
  dataModelId = input.required<number>();
  contextState = inject(DataModelingContextState);
  store = inject(DataModelStore);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DataModelDialogService);

  dataTypeEntries = computed<ObjectSelectorEntry[]>(() => this.store.dataTypes().map(dataType => ({
    id: dataType.typeId,
    label: dataType.name,
    routerLink: ['/model', this.dataModelId(), this.contextState.context(), 'data-type', dataType.typeId!],
  })));

  diagramEntries = computed<ObjectSelectorEntry[]>(() => this.store.diagrams().map(diagram => ({
    id: diagram.id,
    label: diagram.name,
    routerLink: ['/modeler', this.dataModelId(), 'logical', diagram.id!],
  })));

  nodeEntries = computed<ObjectSelectorEntry[]>(() => this.store.nodes().map(node => ({
    id: node.nodeId,
    label: node.name,
    routerLink: ['/model', this.dataModelId(), this.contextState.context(), this.contextState.context() === 'logical' ? 'entity' : 'table', node.nodeId!],
  })));

  addNewDiagram(): void {
    this.dialogService.openCreateDiagramDialog(this.store.diagrams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };

  addNewNode(): void {
    this.dialogService.openCreateEntityDialog(this.store.nodes())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };

  addNewDataType(): void {
    this.dialogService.openCreateDataTypeDialog(this.store.dataTypes())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };
}
