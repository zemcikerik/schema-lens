import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { DataModelerDiagramState } from './data-modeler-diagram-state.service';
import { DataModelStore } from '../data-model.store';
import { TranslatePipe } from '../../core/translate/translate.pipe';
import { DataModelerStateModule } from './data-modeler-state.module';
import { DataModelerDialogService } from './data-modeler-dialog.service';
import { DataModelEdge } from '../models/data-model-edge.model';

@Component({
  selector: 'app-data-modeler',
  templateUrl: './data-modeler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataModelerStateModule,
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
    AlertComponent,
    TranslatePipe,
  ],
})
export class DataModelerComponent {
  dataModelId = input.required<string>();
  diagramId = input.required<string>();

  store = inject(DataModelStore);
  state = inject(DataModelerDiagramState);
  private dialogs = inject(DataModelerDialogService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private diagram = viewChild(SchemaDiagramComponent);

  backLink = computed(() => '/model/' + this.dataModelId());
  currentSelection = signal<SchemaDiagramSelection | null>(null);
  connectMode = signal<boolean>(false);

  constructor() {
    const ids = computed(() => [this.dataModelId(), this.diagramId()] as const);

    // TODO: validate, cleanup css
    toObservable(ids)
      .pipe(
        switchMap(([dataModelId, diagramId]) =>
          this.store.loadModel(+dataModelId).pipe(switchMap(() => this.store.loadDiagram(+diagramId))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => afterNextRender({ mixedReadWrite: () => this.state.initDiagram() }, { injector: this.injector }));
  }

  onConnectNodes({ from, to }: SchemaDiagramConnectNodes): void {
    this.connectMode.set(false);
    this.executeModelingOperation(() => {
      const edge: DataModelEdge = {
        edgeId: null,
        modelId: this.store.dataModelId,
        fromNodeId: from.id,
        toNodeId: to.id,
        type: '1:N',
        isMandatory: false,
        isIdentifying: false,
        fields: [],
      };

      this.state.withLoading(this.store.createEdge(edge)).pipe(
        tap(modification => this.state.applyModification(modification)),
        catchError(() => {
          this.dialogs.openCreationErrorDialog();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
    });
  }

  onDeletePressed(): void {
    const selection = this.currentSelection();

    if (selection?.type !== 'node') {
      return;
    }

    const nodeId = selection.node.id;

    this.dialogs.openDeleteNodeConfirmation().pipe(
      filter(result => result !== null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ deleteFromModel }) => {
      if (!deleteFromModel) {
        this.state.removeNodeFromDiagram(nodeId);
        return;
      }

      this.executeModelingOperation(() => {
        this.state.withLoading(this.store.deleteNode(nodeId)).pipe(
          tap(modification => this.state.applyModification(modification)),
          catchError(() => {
            this.dialogs.openDeleteNodeErrorDialog();
            return of(null);
          }),
        ).subscribe();
      });
    });
  }

  savePositions(): void {
    this.savePositionsInternal();
  }

  private executeModelingOperation(operation: () => void): void {
    this.savePositionsInternal(operation);
  }

  private savePositionsInternal(callback?: () => void): void {
    const diagram = this.diagram();

    if (!diagram || !this.state.hasUnsavedPositions()) {
      callback?.();
      return;
    }

    this.state
      .savePositions(diagram.snapshotDiagramPositions())
      .pipe(
        catchError(() => {
          this.dialogs.openSavePositionsErrorDialog();
          return of(null);
        }),
        filter(result => result !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => callback?.());
  }
}
