import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { DiagramHostComponent } from '../../../diagrams/diagram-host.component';
import { FullscreenDirective } from '../../../core/directives/fullscreen.directive';
import { DiagramZoomControlComponent } from '../../../diagrams/diagram-zoom-control.component';
import { DiagramFullscreenControlComponent } from '../../../diagrams/diagram-fullscreen-control.component';
import { DiagramExportControlComponent } from '../../../diagrams/export/diagram-export-control.component';
import { DiagramGridControlComponent } from '../../../diagrams/diagram-grid-control.component';
import { DataModelerAddActionComponent } from './data-modeler-add-action.component';
import { DataModelerConnectActionComponent } from './data-modeler-connect-action.component';
import { DataModelerSaveActionComponent } from './data-modeler-save-action.component';
import { DataModelerVerifyActionComponent } from './data-modeler-verify-action.component';

@Component({
  selector: 'app-data-modeler-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="data-modeler__actions">
      <app-data-modeler-add-action />
      <app-data-modeler-connect-action [(active)]="connectMode" />
      <div class="separator"></div>
      <app-data-modeler-save-action [hasUnsavedPositions]="hasUnsavedPositions()" (save)="save.emit()" />
      <app-data-modeler-verify-action />
      <div class="separator"></div>
      <app-diagram-grid-control [diagramHost]="diagramHost()" />
      <app-diagram-zoom-control [diagramHost]="diagramHost()" />
      <app-diagram-fullscreen-control [fullscreenHost]="fullscreenHost()" />
      <div class="separator"></div>
      <app-diagram-export-control [diagramHost]="diagramHost()" [additionalClasses]="['schema-diagram', 'hide-grid']" />
    </div>
  `,
  imports: [
    DiagramFullscreenControlComponent,
    DiagramZoomControlComponent,
    DiagramExportControlComponent,
    DiagramGridControlComponent,
    DataModelerAddActionComponent,
    DataModelerConnectActionComponent,
    DataModelerSaveActionComponent,
    DataModelerVerifyActionComponent,
  ],
})
export class DataModelerActionsComponent {
  diagramHost = input.required<DiagramHostComponent>();
  fullscreenHost = input.required<FullscreenDirective>();
  connectMode = model.required<boolean>();
  hasUnsavedPositions = input.required<boolean>();
  save = output();
}
