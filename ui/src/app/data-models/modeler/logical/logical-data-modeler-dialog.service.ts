import { inject, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';
import { LogicalAddExistingEntityDialogComponent, LogicalAddExistingEntityDialogData } from './dialogs/logical-add-existing-entity-dialog/logical-add-existing-entity-dialog.component';
import { LogicalEditAttributeDialogComponent, LogicalEditAttributeDialogData } from './dialogs/logical-edit-attribute-dialog/logical-edit-attribute-dialog.component';
import { DataModelField, DataModelNode, DataModelNodeSummary } from '../../models/data-model-node.model';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { uniqueStringValidator } from '../../../core/validators/unique-string.validator';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { DataModelStore } from '../../data-model.store';

@Injectable()
export class LogicalDataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);
  private store = inject(DataModelStore);

  openAddExistingEntity(entities: DataModelNode[]): Observable<DataModelNode | null> {
    return this.matDialog
      .open(LogicalAddExistingEntityDialogComponent, { data: { entities } satisfies LogicalAddExistingEntityDialogData })
      .afterClosed()
      .pipe(map((entity: DataModelNode) => entity ? entity : null));
  }

  // TODO: deduplicate
  openCreateEntity(entities: DataModelNodeSummary[]): Observable<DataModelNode | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.ENTITY.CREATE.TITLE',
      labelKey: 'DATA_MODEL.ENTITY.CREATE.LABEL',
      placeholderKey: 'DATA_MODEL.ENTITY.CREATE.PLACEHOLDER',
      validators: [
        Validators.required,
        noStartEndWhitespaceValidator,
        Validators.maxLength(40),
        uniqueStringValidator(entities.map(entity => entity.name)),
      ],
    }).pipe(
      switchMap(name => name === null
        ? of(null)
        : this.store.createNode({ name, nodeId: null })),
      map(entity => entity ? entity : null),
      catchError(() => {
        this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
        return of(null);
      }),
    );
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
