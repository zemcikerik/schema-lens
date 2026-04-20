import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../core/dialog.service';
import {
  DataModelerAddExistingNodeDialogComponent,
  DataModelerAddExistingNodeDialogData,
} from './dialogs/data-modeler-add-existing-node-dialog/data-modeler-add-existing-node-dialog.component';
import {
  DataModelerDeleteNodeDialogComponent,
  DataModelerDeleteNodeDialogResult,
} from './dialogs/data-modeler-delete-node-dialog/data-modeler-delete-node-dialog.component';
import { DataModelNode } from '../models/data-model-node.model';
import { DataModelDialogService } from '../services/data-model-dialog.service';
import { DataModelingTranslationKeyResolver } from '../services/data-modeling-translation-key-resolver.service';

@Injectable()
export class DataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private dataModelDialogService = inject(DataModelDialogService);
  private keyResolver = inject(DataModelingTranslationKeyResolver);

  openAddExistingNode(nodes: DataModelNode[]): Observable<DataModelNode | null> {
    return this.matDialog
      .open(DataModelerAddExistingNodeDialogComponent, { data: { nodes } satisfies DataModelerAddExistingNodeDialogData })
      .afterClosed()
      .pipe(map((node: DataModelNode) => node ?? null));
  }

  openCreateNodeDialog(existingNames: string[]): Observable<string | null> {
    return this.dataModelDialogService.openCreateNodeDialog(existingNames);
  }

  openCreationErrorDialog(): void {
    this.dataModelDialogService.openCreationErrorDialog();
  }

  openInvalidPropertiesDialog(): void {
    this.dialogService.openTextDialog(
      'DATA_MODEL.MODELER.DIALOGS.INVALID_PROPERTIES.TITLE',
      'DATA_MODEL.MODELER.DIALOGS.INVALID_PROPERTIES.DESCRIPTION',
    );
  }

  openDeleteNodeErrorDialog(): void {
    this.dialogService.openErrorDialog(
      this.keyResolver.resolveKey('DATA_MODEL.MODELER.DIALOGS.DELETE_NODE.$layer.ERROR_TITLE'),
      'GENERIC.ERROR_LABEL',
    );
  }

  openSavePositionsErrorDialog(): void {
    this.dialogService.openErrorDialog(
      'DATA_MODEL.MODELER.DIALOGS.SAVE_POSITIONS.ERROR_TITLE',
      'GENERIC.ERROR_LABEL',
    );
  }

  openDeleteNodeConfirmation(): Observable<DataModelerDeleteNodeDialogResult | null> {
    return this.matDialog
      .open(DataModelerDeleteNodeDialogComponent)
      .afterClosed()
      .pipe(map(result => result ?? null));
  }

  openDeleteDiagramConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODEL.MODELER.DIALOGS.DELETE_DIAGRAM.TITLE',
      'DATA_MODEL.MODELER.DIALOGS.DELETE_DIAGRAM.DESCRIPTION',
      'danger',
    );
  }
}
