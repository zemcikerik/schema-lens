import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../core/layouts/layout-header-and-content.component';
import { LogicalErDiagramComponent } from './logical-er-diagram.component';
import { LogicalErDiagramPropertiesComponent } from './properties/logical-er-diagram-properties.component';
import { LogicalDataModelerActionsComponent } from './logical-data-modeler-actions.component';
import { FullscreenDirective } from '../../core/directives/fullscreen.directive';

@Component({
  selector: 'app-logical-data-modeler',
  templateUrl: './logical-data-modeler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    LogicalErDiagramComponent,
    LogicalErDiagramPropertiesComponent,
    LogicalDataModelerActionsComponent,
    FullscreenDirective,
  ],
})
export class LogicalDataModelerComponent {}
