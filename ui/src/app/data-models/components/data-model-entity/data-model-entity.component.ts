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
import { DataModelField } from '../../models/data-model-node.model';
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
import { DataModelStore } from '../../data-model.store';
import { EMPTY, forkJoin, of, switchMap } from 'rxjs';

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
  @ViewChild('table', { static: true }) table!: MatTable<DataModelField>;
  readonly ALL_COLUMNS = ['drag', 'primary-key', 'name', 'type', 'nullable', 'actions'];

  entityId = input.required<string>();

  private store = inject(DataModelStore);
  translateService = inject(TranslateService);

  entity = linkedSignal(() => {
    const entity = this.store.nodes().find(e => e.nodeId == +this.entityId());
    // TODO: redirect on null
    return structuredClone(entity);
  });

  entityAttributes = computed(() => this.entity()?.fields ?? []);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private dataModelDialogService = inject(DataModelDialogService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private changes = inject(ChangeDetectorRef);

  dataTypeName = (id: number) =>
    id !== -1
      ? this.store.dataTypes().find(e => e.typeId === id)?.name
      : this.translateService.translate('DATA_MODEL.ENTITY.ATTRIBUTE_NEW.TYPE')();

  deleteAttribute = (attributeId: number | null) => {
    this.dialogService
      .openConfirmationDialog('DATA_MODEL.ENTITY.DELETE_ATTRIBUTE.TITLE', 'DATA_MODEL.ENTITY.DELETE_ATTRIBUTE.DESCRIPTION', 'danger')
      .pipe(
        switchMap(confirmed => {
          if (!confirmed) return EMPTY;
          const removeLocally = () => {
            const attrs = this.entityAttributes();
            attrs.splice(attrs.findIndex(a => a.fieldId === attributeId), 1);
            this.table.renderRows();
          };
          if (attributeId === null) {
            removeLocally();
            return EMPTY;
          }
          this.loading.set(true);
          this.error.set(false);
          return this.store.deleteField(+this.entityId(), attributeId);
        }),
      )
      .subscribe({
        next: () => this.loading.set(false),
        error: () => { this.loading.set(false); this.error.set(true); },
      });
  };

  addAttribute = () => {
    this.entityAttributes().push({
      fieldId: null,
      name: this.translateService.translate('DATA_MODEL.ENTITY.ATTRIBUTE_NEW.NAME')(),
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

  openDataTypeDialog = (attribute: DataModelField) => {
    this.dataModelDialogService.openDataTypeSelectorDialog(attribute, this.store.dataTypes())
      .subscribe(res => {
        if (res !== undefined) {
          attribute.typeId = res.typeId!;
          this.changes.markForCheck();
        }
      });
  };

  // generated quick fix start
  save = () => {
    const entity = this.entity();
    if (!entity) return;

    const entityId = this.entityId();
    const originalFields = this.store.nodes().find(e => e.nodeId === +entityId)?.fields ?? [];
    const updatedAttributes = this.entityAttributes().map((a, i) => ({ ...a, position: i }));

    const toCreate = updatedAttributes.filter(a => a.fieldId === null);
    const toUpdate = updatedAttributes.filter(a => a.fieldId !== null);
    const originalIds = new Set(originalFields.map(a => a.fieldId));
    const updatedIds = new Set(updatedAttributes.filter(a => a.fieldId !== null).map(a => a.fieldId));
    const toDeleteIds = [...originalIds].filter(id => !updatedIds.has(id)) as number[];

    this.loading.set(true);
    this.error.set(false);

    const nodeUpdate$ = this.store.updateNode(entity);
    const creates$ = toCreate.length ? forkJoin(toCreate.map(a => this.store.createField(+entityId, a))) : of([]);
    const updates$ = toUpdate.length ? forkJoin(toUpdate.map(a => this.store.updateField(+entityId, a))) : of([]);
    const deletes$ = toDeleteIds.length ? forkJoin(toDeleteIds.map(id => this.store.deleteField(+entityId, id))) : of([]);

    forkJoin([nodeUpdate$, creates$, updates$, deletes$]).subscribe({
      next: () => this.loading.set(false),
      error: () => { this.loading.set(false); this.error.set(true); },
    });
  };
  // generated quick fix end

  delete = () => {
    this.dialogService
      .openConfirmationDialog('DATA_MODEL.ENTITY.DELETE.TITLE', 'DATA_MODEL.ENTITY.DELETE.DESCRIPTION', 'danger')
      .subscribe({
        next: res => {
          if (!res) return;
          this.error.set(false);
          this.loading.set(true);
          this.store.deleteNode(+this.entityId()).subscribe({
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
