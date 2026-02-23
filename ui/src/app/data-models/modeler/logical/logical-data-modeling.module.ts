import { NgModule } from '@angular/core';
import { LogicalDataModelerDefinition } from './logical-data-modeler.definition';
import { LogicalDataModelingFacade } from './logical-data-modeling.facade';
import { LogicalDataModelingState } from './logical-data-modeling.state';
import { LogicalDataModelerDialogService } from './logical-data-modeler-dialog.service';
import { LogicalModelStore } from '../../logical-model.store';
import { LogicalDiagramMapper } from './logical-diagram.mapper';
import { LogicalEntityAttributeResolverService } from '../../services/logical-entity-attribute-resolver.service';
import { LogicalAttributeEditorService } from '../../services/logical-attribute-editor.service';
import { LogicalRelationshipEditorService } from '../../services/logical-relationship-editor.service';
import { LogicalRelationshipCascadeService } from '../../services/logical-relationship-cascade.service';

@NgModule({
  providers: [
    LogicalDataModelerDefinition,
    LogicalModelStore,
    LogicalDiagramMapper,
    LogicalDataModelingState,
    LogicalDataModelingFacade,
    LogicalDataModelerDialogService,
    LogicalEntityAttributeResolverService,
    LogicalRelationshipCascadeService,
    LogicalAttributeEditorService,
    LogicalRelationshipEditorService,
  ],
})
export class LogicalDataModelingModule {
}
