import { NgModule } from '@angular/core';
import { DataModelerState } from './data-modeler-state.service';
import { DataModelerDiagramMapper } from './data-modeler-diagram.mapper';
import { DataModelerDialogService } from './data-modeler-dialog.service';
import { DataModelerEditorResolverService } from './properties/data-modeler-editor-resolver.service';

@NgModule({
  providers: [DataModelerState, DataModelerDiagramMapper, DataModelerDialogService, DataModelerEditorResolverService],
})
export class DataModelerStateModule {}
