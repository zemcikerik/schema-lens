import { inject, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LogicalAttribute, LogicalDataType, LogicalEntity } from '../models/logical-model.model';
import { DataModelDiagram } from '../models/data-model-diagram.model';
import {
  DataTypeCreateDialogComponent,
  DataTypeCreateDialogData,
} from '../components/data-type-create-dialog/data-type-create-dialog.component';
import {
  DataTypeSelectorDialogComponent,
  DataTypeDialogData,
} from '../components/data-type-selector-dialog/data-type-selector-dialog.component';
import {
  DiagramCreateDialogComponent,
  DiagramCreateDialogData,
} from '../components/diagram-create-dialog/diagram-create-dialog.component';
import {
  EntityCreateDialogComponent,
  EntityCreateDialogData,
} from '../components/entity-create-dialog/entity-create-dialog.component';

@Injectable()
export class DataModelDialogService {
  private matDialog = inject(MatDialog);
  private injector = inject(Injector);

  openCreateDiagramDialog(diagrams: DataModelDiagram[]): Observable<DataModelDiagram | undefined> {
    const data: DiagramCreateDialogData = { diagrams };
    return this.matDialog.open(DiagramCreateDialogComponent, { data, injector: this.injector }).afterClosed();
  }

  openCreateEntityDialog(entities: LogicalEntity[]): Observable<LogicalEntity | undefined> {
    const data: EntityCreateDialogData = { entities };
    return this.matDialog.open(EntityCreateDialogComponent, { data, injector: this.injector }).afterClosed();
  }

  openCreateDataTypeDialog(dataTypes: LogicalDataType[]): Observable<unknown> {
    const data: DataTypeCreateDialogData = { dataTypes };
    return this.matDialog.open(DataTypeCreateDialogComponent, { data, injector: this.injector}).afterClosed();
  }

  openDataTypeSelectorDialog(attribute: LogicalAttribute, dataTypes: LogicalDataType[]): Observable<LogicalDataType | undefined> {
    const data: DataTypeDialogData = { targetAttribute: attribute, dataTypes };
    return this.matDialog.open(DataTypeSelectorDialogComponent, { data, injector: this.injector }).afterClosed();
  }
}
