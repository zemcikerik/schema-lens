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
import { SchemaDiagramComponent } from '../../diagrams/schema/schema-diagram.component';
import { BlockExitDirective } from '../../core/directives/block-exit.directive';
import { SchemaDiagramConnectNodes } from '../../diagrams/schema/model/schema-diagram-connect-nodes.model';
import { MatProgressBar } from '@angular/material/progress-bar';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { catchError, defer, filter, from, map, mergeMap, NEVER, Observable, of, switchMap, tap } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { DataModelerDiagramState } from './data-modeler-diagram.state';
import { DataModelStore } from '../data-model.store';
import { TranslatePipe } from '../../core/translate/translate.pipe';
import { DataModelerStateModule } from './data-modeler-state.module';
import { DataModelerDialogService } from './data-modeler-dialog.service';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelContextState } from '../data-model-context.state';
import { mapContextToDataModelDiagramType, mapDataModelDiagramTypeToContext } from '../models/data-model-diagram.model';

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
  private contextState = inject(DataModelContextState);
  private dialogs = inject(DataModelerDialogService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private router = inject(Router);
  private diagram = viewChild(SchemaDiagramComponent);

  backNavigationCommand = computed(() => ['/model', this.dataModelId(), this.contextState.context()]);
  connectMode = signal<boolean>(false);

  constructor() {
    toObservable(computed(() => [this.dataModelId(), this.diagramId()] as const))
      .pipe(
        map(([dataModelId, diagramId]) => [+dataModelId, +diagramId] as const),
        switchMap(([dataModelId, diagramId]) => {
          if (isNaN(dataModelId) || isNaN(diagramId)) {
            return this.redirectTo404();
          }

          return this.store
            .loadModel(dataModelId)
            .pipe(
              switchMap(model => model ? this.store.loadDiagram(diagramId) : this.redirectTo404()),
              mergeMap(diagram => {
                if (!diagram) {
                  return this.redirectTo404();
                }

                const switchToCorrectContext$ = diagram.type !== mapContextToDataModelDiagramType(this.contextState.context())
                  ? from(this.contextState.switchToContext(mapDataModelDiagramTypeToContext(diagram.type)))
                  : of(false);

                return switchToCorrectContext$.pipe(map(() => diagram));
              }),
            );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(diagram =>
        afterNextRender({ mixedReadWrite: () => this.state.initDiagram(diagram) }, { injector: this.injector }),
      );
  }

  onConnectNodes({ from, to }: SchemaDiagramConnectNodes): void {
    this.connectMode.set(false);

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
  }

  onDeletePressed(): void {
    const selection = this.state.currentSelection();

    if (!selection) {
      return;
    }

    if (selection.type === 'node') {
      this.deleteNode(selection.node.id);
    } else {
      this.deleteEdge(selection.edge.id);
    }
  }

  private deleteNode(nodeId: number): void {
    this.dialogs.openDeleteNodeConfirmation().pipe(
      filter(result => result !== null),
      mergeMap(({ deleteFromModel }) => {
        if (!deleteFromModel) {
          this.state.removeNodeFromDiagram(nodeId);
          return of(null);
        }

        return this.state.withLoading(this.store.deleteNode(nodeId)).pipe(
          tap(modification => this.state.applyModification(modification)),
          catchError(() => {
            this.dialogs.openDeleteNodeErrorDialog();
            return of(null);
          }),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  private deleteEdge(edgeId: number): void {
    this.dialogs.openDeleteEdgeConfirmation().pipe(
      filter(result => result === true),
      mergeMap(() =>
        this.state.withLoading(this.store.deleteEdge(edgeId)).pipe(
          tap(modification => this.state.applyModification(modification)),
          catchError(() => {
            this.dialogs.openDeleteEdgeErrorDialog();
            return of(null);
          }),
        ),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  savePositions(): void {
    const diagram = this.diagram();

    if (!diagram || !this.state.hasUnsavedPositions()) {
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
      .subscribe();
  }

  private redirectTo404(): Observable<never> {
    return defer(() => this.router.navigate(['/404'])).pipe(mergeMap(() => NEVER));
  }
}
