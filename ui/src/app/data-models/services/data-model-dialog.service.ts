import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataModelField } from '../models/data-model-node.model';
import { DialogService } from '../../core/dialog.service';
import { DataModelStore } from '../data-model.store';
import { MatDialog } from '@angular/material/dialog';
import {
  DataModelNodeFieldFormDialogComponent,
  DataModelNodeFieldFormDialogData,
} from '../components/data-model-node-field-form-dialog/data-model-node-field-form-dialog.component';
import {
  DataModelEdgeFieldFormDialogComponent,
  DataModelEdgeFieldFormDialogData,
} from '../components/data-model-edge-field-form-dialog/data-model-edge-field-form-dialog.component';
import { DataModelEdgeField } from '../models/data-model-edge.model';
import {
  dataModelDataTypeNameValidators,
  dataModelDiagramNameValidators,
  dataModelNodeNameValidators,
} from '../validators/data-model-name.validators';
import {
  DEFAULT_NODE_FIELD_ADD_BUTTON_ID
} from '../components/data-model-node-editor/data-model-node-editor.component';

@Injectable({ providedIn: 'root' })
export class DataModelDialogService {
  private dialogService = inject(DialogService);
  private matDialog = inject(MatDialog);
  private store = inject(DataModelStore);

  openCreateDiagramDialog(): Observable<string | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.DIAGRAM.CREATE.TITLE',
      labelKey: 'DATA_MODEL.DIAGRAM.CREATE.LABEL',
      placeholderKey: 'DATA_MODEL.DIAGRAM.CREATE.PLACEHOLDER',
      validators: dataModelDiagramNameValidators(),
    });
  }

  openCreateNodeDialog(existingNames: string[]): Observable<string | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.NODE.CREATE_TITLE',
      labelKey: 'DATA_MODEL.NODE.NAME_LABEL',
      validators: dataModelNodeNameValidators(existingNames),
    });
  }

  openCreateDataTypeDialog(existingNames: string[]): Observable<string | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.DATA_TYPE.CREATE_TITLE',
      labelKey: 'DATA_MODEL.DATA_TYPE.NAME_LABEL',
      validators: dataModelDataTypeNameValidators(existingNames),
    });
  }

  openCreationErrorDialog(): void {
    this.dialogService.openErrorDialog('DATA_MODEL.CREATION_ERROR_TITLE', 'GENERIC.ERROR_LABEL');
  }

  openFieldFormDialog(existingFieldNames: string[], field?: DataModelField): Observable<DataModelField | null> {
    const data: DataModelNodeFieldFormDialogData = {
      field: field ?? null,
      dataTypes: this.store.dataTypes(),
      existingFieldNames,
    };

    return this.matDialog
      .open(DataModelNodeFieldFormDialogComponent, { data, restoreFocus: `#${DEFAULT_NODE_FIELD_ADD_BUTTON_ID}` })
      .afterClosed()
      .pipe(map(result => result ?? null));
  }

  openEdgeFieldFormDialog(existingFieldNames: string[], field: DataModelEdgeField): Observable<DataModelEdgeField | null> {
    const data: DataModelEdgeFieldFormDialogData = { field, existingFieldNames };

    return this.matDialog
      .open(DataModelEdgeFieldFormDialogComponent, { data, restoreFocus: `#${DEFAULT_NODE_FIELD_ADD_BUTTON_ID}` })
      .afterClosed()
      .pipe(map(result => result ?? null));
  }

  openDeleteNodeConfirmationDialog(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODEL.NODE.DELETE_TITLE',
      'DATA_MODEL.NODE.DELETE_DESCRIPTION',
      'danger',
    );
  }

  openDeleteFieldConfirmationDialog(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODEL.NODE.DELETE_FIELD_TITLE',
      'DATA_MODEL.NODE.DELETE_FIELD_DESCRIPTION',
      'danger',
      { restoreFocus: `#${DEFAULT_NODE_FIELD_ADD_BUTTON_ID}` },
    );
  }
}
