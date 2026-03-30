import { inject, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';
import { LogicalAddExistingEntityDialogComponent, LogicalAddExistingEntityDialogData } from './dialogs/logical-add-existing-entity-dialog/logical-add-existing-entity-dialog.component';
import { LogicalEditAttributeDialogComponent, LogicalEditAttributeDialogData } from './dialogs/logical-edit-attribute-dialog/logical-edit-attribute-dialog.component';
import { DataModelField, DataModelDataType, DataModelNode, DataModelNodeSummary } from '../../models/data-model-types.model';
import { DataModelEntityCreateDialogComponent, DataModelEntityCreateDialogData } from '../../components/data-model-entity-create-dialog/data-model-entity-create-dialog.component';

@Injectable()
export class LogicalDataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);

  openAddExistingEntity(entities: DataModelNode[]): Observable<DataModelNode | null> {
    return this.matDialog
      .open(LogicalAddExistingEntityDialogComponent, { data: { entities } satisfies LogicalAddExistingEntityDialogData })
      .afterClosed()
      .pipe(map((entity: DataModelNode) => entity ? entity : null));
  }

  openCreateEntity(entities: DataModelNodeSummary[]): Observable<DataModelNode | null> {
    return this.matDialog
      .open(DataModelEntityCreateDialogComponent, { data: { entities } satisfies DataModelEntityCreateDialogData, injector: this.injector })
      .afterClosed()
      .pipe(map((entity: DataModelNode) => entity ? entity : null));
  }

  openCreateAttribute(dataTypes: DataModelDataType[]): Observable<DataModelField | null> {
    const blank: DataModelField = {
      fieldId: null,
      name: '',
      typeId: dataTypes[0]?.typeId ?? -1,
      isPrimaryKey: false,
      isNullable: false,
      position: -1,
    };

    return this.matDialog
      .open(LogicalEditAttributeDialogComponent, {
        data: { attribute: blank, dataTypes } satisfies LogicalEditAttributeDialogData,
        injector: this.injector,
      })
      .afterClosed()
      .pipe(map((result: DataModelField | undefined) => result ?? null));
  }

  openEditAttribute(attribute: DataModelField, dataTypes: DataModelDataType[]): Observable<DataModelField | null> {
    return this.matDialog
      .open(LogicalEditAttributeDialogComponent, {
        data: { attribute, dataTypes } satisfies LogicalEditAttributeDialogData,
        injector: this.injector,
      })
      .afterClosed()
      .pipe(map((result: DataModelField | undefined) => result ?? null));
  }

  openDeleteEntityConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ENTITY_CONFIRM_TITLE',
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ENTITY_CONFIRM_DESCRIPTION',
      'danger',
    );
  }

  openDeleteDiagramConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_DIAGRAM_CONFIRM_TITLE',
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_DIAGRAM_CONFIRM_DESCRIPTION',
      'danger',
    );
  }

  openDeleteAttributeConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ATTRIBUTE_CONFIRM_TITLE',
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ATTRIBUTE_CONFIRM_DESCRIPTION',
      'danger',
    );
  }
}
