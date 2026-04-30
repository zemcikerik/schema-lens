import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, finalize, of, switchMap } from 'rxjs';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataModelStore } from '../../data-model.store';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { ObjectSelectorComponent, ObjectSelectorEntry } from '../../../shared/components/object-selector/object-selector.component';
import { DataModelContextSwitcherComponent } from '../data-model-context-switcher/data-model-context-switcher.component';
import { DataModelContextState } from '../../data-model-context.state';
import { mapContextToDataModelDiagramType } from '../../models/data-model-diagram.model';

@Component({
  selector: 'app-data-model-nav',
  templateUrl: './data-model-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    SidebarCloseDirective,
    MatIcon,
    MatIconButton,
    ObjectSelectorComponent,
    TranslatePipe,
    DataModelContextSwitcherComponent,
  ],
})
export class DataModelNavComponent {
  dataModelId = input.required<number>();
  contextState = inject(DataModelContextState);
  store = inject(DataModelStore);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DataModelDialogService);

  diagramCreating = signal<boolean>(false);
  nodeCreating = signal<boolean>(false);
  dataTypeCreating = signal<boolean>(false);

  private dataTypeEntries$ = toObservable(computed(() =>
    this.store.dataTypes().map(dataType => ({
      id: dataType.typeId,
      label: dataType.name,
      routerLink: [
        '/model',
        this.dataModelId(),
        this.contextState.context(),
        this.contextState.context() === 'logical' ? 'domain' : 'data-type',
        dataType.typeId as number,
      ],
    } satisfies ObjectSelectorEntry))
  ));

  private diagramEntries$ = toObservable(computed(() =>
    this.store
      .diagrams()
      .filter(diagram => diagram.type === mapContextToDataModelDiagramType(this.contextState.context()))
      .map(diagram => ({
        id: diagram.id,
        label: diagram.name,
        routerLink: ['/modeler', this.dataModelId(), diagram.type, diagram.id as number],
      } satisfies ObjectSelectorEntry))
  ));

  private nodeEntries$ = toObservable(computed(() =>
    this.store.nodes().map(node => ({
      id: node.nodeId,
      label: node.name,
      routerLink: [
        '/model',
        this.dataModelId(),
        this.contextState.context(),
        this.contextState.context() === 'logical' ? 'entity' : 'table',
        node.nodeId as number,
      ],
    } satisfies ObjectSelectorEntry))
  ));

  private edgeEntries$ = toObservable(computed(() =>
    this.store.edges().map(edge => ({
      id: edge.edgeId,
      label: `#${edge.edgeId}`,
      routerLink: [
        '/model',
        this.dataModelId(),
        this.contextState.context(),
        'relationship',
        edge.edgeId as number,
      ],
    } satisfies ObjectSelectorEntry))
  ));

  dataTypeLoadEntries: () => Observable<ObjectSelectorEntry[]> = () => this.dataTypeEntries$;
  diagramLoadEntries: () => Observable<ObjectSelectorEntry[]> = () => this.diagramEntries$;
  nodeLoadEntries: () => Observable<ObjectSelectorEntry[]> = () => this.nodeEntries$;
  edgeLoadEntries: () => Observable<ObjectSelectorEntry[]> = () => this.edgeEntries$;

  addNewDiagram(): void {
    this.dialogService.openCreateDiagramDialog()
      .pipe(
        switchMap(name => {
          if (name === null) {
            return of(null);
          }
          
          this.diagramCreating.set(true);
          const type = mapContextToDataModelDiagramType(this.contextState.context());

          return this.store.createDiagram({ name, type, id: null, edges: [], nodes: [] }).pipe(
            finalize(() => this.diagramCreating.set(false)),
          );
        }),
        catchError(() => {
          this.dialogService.openCreationErrorDialog();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  addNewNode(): void {
    this.dialogService.openCreateNodeDialog(this.store.nodes().map(n => n.name))
      .pipe(
        switchMap(name => {
          if (name === null) {
            return of(null);
          }
          this.nodeCreating.set(true);
          return this.store.createNode({ name, nodeId: null }).pipe(
            finalize(() => this.nodeCreating.set(false)),
          );
        }),
        catchError(() => {
          this.dialogService.openCreationErrorDialog();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  addNewDataType(): void {
    this.dialogService.openCreateDataTypeDialog(this.store.dataTypes().map(dt => dt.name))
      .pipe(
        switchMap(name => {
          if (name === null) {
            return of(null);
          }
          this.dataTypeCreating.set(true);
          return this.store.createDataType({ name, typeId: null }).pipe(
            finalize(() => this.dataTypeCreating.set(false)),
          );
        }),
        catchError(() => {
          this.dialogService.openCreationErrorDialog();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
