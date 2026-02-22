import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../core/layouts/layout-header-and-content.component';
import { DataModelerActionsComponent } from './actions/data-modeler-actions.component';
import { FullscreenDirective } from '../../core/directives/fullscreen.directive';
import { DataModelerPropertiesHostComponent } from './properties/data-modeler-properties-host.component';
import { SchemaDiagramSelection } from '../../diagrams/schema/model/schema-diagram-selection.model';
import { SchemaDiagramComponent } from '../../diagrams/schema/schema-diagram.component';
import { BlockExitDirective } from '../../core/directives/block-exit.directive';
import { SchemaDiagramConnectNodes } from '../../diagrams/schema/model/schema-diagram-connect-nodes.model';
import { MatProgressBar } from '@angular/material/progress-bar';
import { DATA_MODELING_FACADE } from './data-modeling.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-data-modeler',
  templateUrl: './data-modeler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    DataModelerActionsComponent,
    FullscreenDirective,
    DataModelerPropertiesHostComponent,
    SchemaDiagramComponent,
    BlockExitDirective,
    MatProgressBar,
    RouterLink,
    MatIconButton,
    MatIcon,
  ],
})
export class DataModelerComponent {
  modelingFacade = inject(DATA_MODELING_FACADE);
  private destroyRef = inject(DestroyRef);
  private diagram = viewChild.required(SchemaDiagramComponent);

  backLink = input.required<string>();
  currentSelection = signal<SchemaDiagramSelection | null>(null);
  connectMode = signal<boolean>(false);
  hasUnsavedPositions = signal<boolean>(false);

  onConnectNodes({ from, to }: SchemaDiagramConnectNodes): void {
    this.connectMode.set(false);
    this.executeModelingOperation(() => this.modelingFacade.connect(from, to));
  }

  onDeletePressed(): void {
    const selection = this.currentSelection();
    if (!selection) {
      return;
    }

    if (selection.type === 'node') {
      this.executeModelingOperation(() => this.modelingFacade.deleteNode(selection.node.id));
    } else {
      this.executeModelingOperation(() => this.modelingFacade.deleteEdge(selection.edge.id));
    }
  }

  savePositions(): void {
    this.savePositionsInternal();
  }

  private executeModelingOperation(operation: () => void): void {
    this.savePositionsInternal(operation);
  }

  private savePositionsInternal(callback?: () => void): void {
    if (!this.hasUnsavedPositions()) {
      callback?.();
      return;
    }

    this.modelingFacade.savePositions(this.diagram().snapshotDiagramPositions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.hasUnsavedPositions.set(false);
        callback?.();
      });
  }
}
