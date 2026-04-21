import { NgModule } from '@angular/core';
import { DataModelerDiagramState } from './data-modeler-diagram-state.service';
import { DataModelerDiagramMapper } from './data-modeler-diagram.mapper';
import { DataModelerDialogService } from './data-modeler-dialog.service';
import { DataModelerEditorResolverService } from './properties/data-modeler-editor-resolver.service';

@NgModule({
  providers: [DataModelerDiagramState, DataModelerDiagramMapper, DataModelerDialogService, DataModelerEditorResolverService],
})
export class DataModelerStateModule {}
