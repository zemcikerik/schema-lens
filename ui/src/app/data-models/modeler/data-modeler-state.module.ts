import { NgModule } from '@angular/core';
import { DataModelerDiagramState } from './data-modeler-diagram.state';
import { DataModelerDiagramMapper } from './data-modeler-diagram.mapper';
import { DataModelerDialogService } from './data-modeler-dialog.service';
import { DataModelerEditorResolverService } from './properties/data-modeler-editor-resolver.service';
import { DataModelerGoToEdgeHandler } from './data-modeler-go-to-edge-handler.service';
import { GO_TO_EDGE_HANDLER } from '../services/data-model-go-to-edge-handler.service';

@NgModule({
  providers: [
    DataModelerDiagramState,
    DataModelerDiagramMapper,
    DataModelerDialogService,
    DataModelerEditorResolverService,
    { provide: GO_TO_EDGE_HANDLER, useClass: DataModelerGoToEdgeHandler },
  ],
})
export class DataModelerStateModule {}
