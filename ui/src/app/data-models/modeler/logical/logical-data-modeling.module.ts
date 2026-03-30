import { NgModule } from '@angular/core';
import { LogicalDataModelerDefinition } from './logical-data-modeler.definition';
import { LogicalDataModelingFacade } from './logical-data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { DataModelStore } from '../../data-model.store';
import { LogicalDiagramMapper } from './logical-diagram.mapper';
import { LogicalEntityAttributeResolverService } from '../../services/logical-entity-attribute-resolver.service';

@NgModule({
  providers: [
    LogicalDataModelerDefinition,
    DataModelStore,
    LogicalDiagramMapper,
    LogicalDataModelingState,
    LogicalDataModelingFacade,
    LogicalDataModelerDialogService,
    LogicalEntityAttributeResolverService,
  ],
})
export class LogicalDataModelingModule {
}
