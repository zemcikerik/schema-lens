import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { StatusIconComponent } from '../../../shared/components/status-icon/status-icon.component';
import { Router } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LogicalAttribute } from '../../models/logical-model.model';
import { TableConstraintIconComponent } from '../../../tables/components/table-constraint-icon/table-constraint-icon.component';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DialogService } from '../../../core/dialog.service';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../../../core/translate/translate.service';
import { LogicalModelStore } from '../../modeler/logical/logical-model.store';

// TODO: oof

@Component({
  selector: 'app-data-model-entity',
  templateUrl: './data-model-entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    TranslatePipe,
    StatusIconComponent,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuContent,
    MatMenuItem,
    TableConstraintIconComponent,
    MatTooltip,
    MatButton,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ProgressSpinnerComponent,
    AlertComponent,
    FormsModule,
  ],
})
export class DataModelEntityComponent {
  @ViewChild('table', { static: true }) table!: MatTable<LogicalAttribute>;
  readonly ALL_COLUMNS = ['drag', 'primary-key', 'name', 'type', 'nullable', 'actions'];

  entityId = input.required<number>();

  private store = inject(LogicalModelStore);
  translateService = inject(TranslateService);

  entity = linkedSignal(() => {
    const entity = this.store.entities().find(e => e.entityId == this.entityId());
    // TODO: redirect on null
    return structuredClone(entity);
  });

  entityAttributes = computed(() => this.entity()?.attributes ?? []);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private dataModelDialogService = inject(DataModelDialogService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private changes = inject(ChangeDetectorRef);

  dataTypeName = (id: number) =>
    id !== -1
      ? this.store.dataTypes().find(e => e.typeId === id)?.name
      : this.translateService.translate('DATAMODEL.ENTITY.ATTRIBUTE_NEW.TYPE')();

  deleteAttribute = (attributeId: number) => {
    this.dialogService
      .openConfirmationDialog('DATAMODEL.ENTITY.DELETE_ATTR.TITLE', 'DATAMODEL.ENTITY.DELETE_ATTR.DESC', 'danger')
      .subscribe({
        next: res => {
          if (res) {
            this.entityAttributes()?.splice(
              this.entityAttributes().findIndex(a => a.attributeId === attributeId),
              1,
            );
            this.table.renderRows();
          }
        },
      });
  };

  addAttribute = () => {
    this.entityAttributes().push({
      attributeId: null,
      name: this.translateService.translate('DATAMODEL.ENTITY.ATTRIBUTE_NEW.NAME')(),
      typeId: -1,
      isPrimaryKey: false,
      isNullable: false,
      position: -1,
    });
    this.table.renderRows();
  };

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.entityAttributes().findIndex(d => d === event.item.data);
    moveItemInArray(this.entityAttributes(), previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  openDataTypeDialog = (attribute: LogicalAttribute) => {
    this.dataModelDialogService.openDataTypeSelectorDialog(attribute, this.store.dataTypes())
      .subscribe(res => {
        if (res !== undefined) {
          attribute.typeId = res.typeId!;
          this.changes.markForCheck();
        }
      });
  };

  save = () => {
    const entity = this.entity();
    if (entity) {
      this.loading.set(true);
      this.error.set(false);
      this.store.updateEntity(entity).subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
    }
  };

  delete = () => {
    this.dialogService
      .openConfirmationDialog('DATAMODEL.ENTITY.DELETE.TITLE', 'DATAMODEL.ENTITY.DELETE.DESC', 'danger')
      .subscribe({
        next: res => {
          if (!res) return;
          this.error.set(false);
          this.loading.set(true);
          this.store.deleteEntity(this.entityId()).subscribe({
            next: async () => {
              this.loading.set(false);
              await this.router.navigate(['/model', this.store.dataModelId]);
            },
            error: () => {
              this.loading.set(false);
              this.error.set(true);
            },
          });
        },
      });
  };
}
