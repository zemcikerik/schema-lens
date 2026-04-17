import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelField, DataModelNodeSummary } from '../models/data-model-node.model';
import { DataModelDiagram } from '../models/data-model-diagram.model';
import { DialogService } from '../../core/dialog.service';
import { noStartEndWhitespaceValidator } from '../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../core/validators/unique-string.validator';
import { DataModelStore } from '../data-model.store';
import { MatDialog } from '@angular/material/dialog';
import {
  DataModelNodeFieldFormDialogComponent,
  DataModelNodeFieldFormDialogData,
} from '../components/data-model-node-field-form-dialog/data-model-node-field-form-dialog.component';
import { DataModelingTranslationKeyResolver } from './data-modeling-translation-key-resolver.service';

// TODO: move from this service to nav

@Injectable({ providedIn: 'root' })
export class DataModelDialogService {
  private dialogService = inject(DialogService);
  private matDialog = inject(MatDialog);
  private store = inject(DataModelStore);
  private keyResolver = inject(DataModelingTranslationKeyResolver);

  openCreateDiagramDialog(diagrams: DataModelDiagram[]): Observable<DataModelDiagram | null> {
    return this.dialogService
      .openInputDialog({
        titleKey: 'DATA_MODEL.DIAGRAM.CREATE.TITLE',
        labelKey: 'DATA_MODEL.DIAGRAM.CREATE.LABEL',
        placeholderKey: 'DATA_MODEL.DIAGRAM.CREATE.PLACEHOLDER',
        validators: this.createNameValidators(diagrams.map(diagram => diagram.name)),
      })
      .pipe(
        switchMap(name =>
          name === null ? of(null) : this.store.createDiagram({ name, type: 'logical', id: null, edges: [], nodes: [] }),
        ),
        catchError(() => {
          this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
          return of(null);
        }),
      );
  }

  openCreateEntityDialog(entities: DataModelNodeSummary[]): Observable<DataModelNodeSummary | null> {
    return this.dialogService
      .openInputDialog({
        titleKey: this.keyResolver.resolveKey('DATA_MODEL.NODE.$layer.CREATE_TITLE'),
        labelKey: this.keyResolver.resolveKey('DATA_MODEL.NODE.NAME_LABEL'),
        validators: this.createNameValidators(entities.map(entity => entity.name)),
      })
      .pipe(
        switchMap(name => (name === null ? of(null) : this.store.createNode({ name, nodeId: null }))),
        catchError(() => {
          this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
          return of(null);
        }),
      );
  }

  openCreateDataTypeDialog(dataTypes: DataModelDataType[]): Observable<DataModelDataType | null> {
    return this.dialogService
      .openInputDialog({
        titleKey: 'DATA_MODEL.DATA_TYPE.CREATE_TITLE',
        labelKey: 'DATA_MODEL.DATA_TYPE.NAME_LABEL',
        validators: this.createNameValidators(dataTypes.map(dataType => dataType.name)),
      })
      .pipe(
        switchMap(name => (name === null ? of(null) : this.store.createDataType({ name, typeId: null }))),
        catchError(() => {
          this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
          return of(null);
        }),
      );
  }

  openFieldFormDialog(field?: DataModelField): Observable<DataModelField | null> {
    const data: DataModelNodeFieldFormDialogData = { field: field ?? null, dataTypes: this.store.dataTypes() };

    return this.matDialog.open(DataModelNodeFieldFormDialogComponent, { data })
      .afterClosed()
      .pipe(map(result => result ?? null));
  }

  openDeleteNodeConfirmationDialog(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'Delete Node',
      'Are you sure you want to delete this node? This will delete all fields and relationships associated with it.',
      'danger',
    );
  }

  openDeleteFieldConfirmationDialog(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'Delete Field',
      'Are you sure you want to delete this field?',
      'danger',
    );
  }

  private createNameValidators(existingNames: string[]) {
    return [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(40), uniqueStringValidator(existingNames)];
  }
}
