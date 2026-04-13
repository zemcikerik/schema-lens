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
    MatIcon,
    MatIconButton,
    ObjectSelectorComponent,
    TranslatePipe,
  ],
})
export class DataModelNavComponent {
  dataModelId = input.required<number>();
  store = inject(DataModelStore);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DataModelDialogService);

  diagramEntries = computed<ObjectSelectorEntry[]>(() => this.store.diagrams().map(diagram => ({
    id: diagram.id,
    label: diagram.name,
    routerLink: ['/modeler', this.dataModelId(), 'logical', diagram.id!],
  })));

  entityEntries = computed<ObjectSelectorEntry[]>(() => this.store.nodes().map(entity => ({
    id: entity.nodeId,
    label: entity.name,
    routerLink: ['/model', this.dataModelId(), 'entity', entity.nodeId!],
  })));

  dataTypeEntries = computed<ObjectSelectorEntry[]>(() => this.store.dataTypes().map(dataType => ({
    id: dataType.typeId,
    label: dataType.name,
    routerLink: ['/model', this.dataModelId(), 'data-type', dataType.typeId!],
  })));

  addNewDiagram(): void {
    this.dialogService.openCreateDiagramDialog(this.store.diagrams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };

  addNewEntity(): void {
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
