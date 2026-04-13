import { NgModule } from '@angular/core';
import { LogicalDataModelerDefinition } from './logical-data-modeler.definition';
import { LogicalDataModelingFacade } from './logical-data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { LogicalDiagramMapper } from './logical-diagram.mapper';

@NgModule({
  providers: [
    LogicalDataModelerDefinition,
    LogicalDiagramMapper,
    LogicalDataModelingState,
    LogicalDataModelingFacade,
    LogicalDataModelerDialogService,
  ],
})
export class LogicalDataModelingModule {
}
