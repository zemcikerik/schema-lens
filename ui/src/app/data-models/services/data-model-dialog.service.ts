import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelNodeSummary } from '../models/data-model-node.model';
import { DataModelDiagram } from '../models/data-model-diagram.model';
import { DialogService } from '../../core/dialog.service';
import { noStartEndWhitespaceValidator } from '../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../core/validators/unique-string.validator';
import { DataModelStore } from '../data-model.store';

// TODO: move from this service to nav

@Injectable({ providedIn: 'root' })
export class DataModelDialogService {
  private dialogService = inject(DialogService);
  private store = inject(DataModelStore);

  openCreateDiagramDialog(diagrams: DataModelDiagram[]): Observable<DataModelDiagram | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.DIAGRAM.CREATE.TITLE',
      labelKey: 'DATA_MODEL.DIAGRAM.CREATE.LABEL',
      placeholderKey: 'DATA_MODEL.DIAGRAM.CREATE.PLACEHOLDER',
      validators: this.createNameValidators(diagrams.map(diagram => diagram.name)),
    }).pipe(
      switchMap(name => name === null
        ? of(null)
        : this.store.createDiagram({ name, type: 'logical', id: null, edges: [], nodes: [] })),
      catchError(() => {
        this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
        return of(null);
      }),
    );
  }

  openCreateEntityDialog(entities: DataModelNodeSummary[]): Observable<DataModelNodeSummary | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.ENTITY.CREATE.TITLE',
      labelKey: 'DATA_MODEL.ENTITY.CREATE.LABEL',
      placeholderKey: 'DATA_MODEL.ENTITY.CREATE.PLACEHOLDER',
      validators: this.createNameValidators(entities.map(entity => entity.name)),
    }).pipe(
      switchMap(name => name === null
        ? of(null)
        : this.store.createNode({ name, nodeId: null })),
      catchError(() => {
        this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
        return of(null);
      }),
    );
  }

  openCreateDataTypeDialog(dataTypes: DataModelDataType[]): Observable<DataModelDataType | null> {
    return this.dialogService.openInputDialog({
      titleKey: 'DATA_MODEL.DATA_TYPE.CREATE_TITLE',
      labelKey: 'DATA_MODEL.DATA_TYPE.NAME_LABEL',
      validators: this.createNameValidators(dataTypes.map(dataType => dataType.name)),
    }).pipe(
      switchMap(name => name === null
        ? of(null)
        : this.store.createDataType({ name, typeId: null })),
      catchError(() => {
        this.dialogService.openTextDialog('GENERIC.TOOLTIP_ERROR_LABEL', 'GENERIC.ERROR_LABEL');
        return of(null);
      }),
    );
  }

  // Reuse the existing validation rules and allow each caller to supply uniqueness values.
  private createNameValidators(existingNames: string[]) {
    return [
      Validators.required,
      noStartEndWhitespaceValidator,
      Validators.maxLength(40),
      uniqueStringValidator(existingNames),
    ];
  }
}
