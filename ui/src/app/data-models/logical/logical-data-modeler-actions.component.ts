import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DiagramHostComponent } from '../../diagrams/diagram-host.component';
import { FullscreenDirective } from '../../core/directives/fullscreen.directive';
import { DiagramZoomControlComponent } from '../../diagrams/diagram-zoom-control.component';
import { DiagramFullscreenControlComponent } from '../../diagrams/diagram-fullscreen-control.component';
import { DiagramExportControlComponent } from '../../diagrams/export/diagram-export-control.component';
import { DiagramGridControlComponent } from '../../diagrams/diagram-grid-control.component';

@Component({
  selector: 'app-logical-data-modeler-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="logical-data-modeler__actions">
      <div>Hello</div>
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
  ],
})
export class LogicalDataModelerActionsComponent {
  diagramHost = input.required<DiagramHostComponent>();
  fullscreenHost = input.required<FullscreenDirective>();
}
