import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { DataModelerDiagramState } from '../data-modeler-diagram-state.service';
import { DataModelerDialogService } from '../data-modeler-dialog.service';
import { DataModelStore } from '../../data-model.store';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-add-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.ADD_NODE_TOOLTIP' | translate)()"
      [matMenuTriggerFor]="addMenu"
    >
      <mat-icon>add_box</mat-icon>
    </button>

    <mat-menu #addMenu>
      <button mat-menu-item (click)="createNode()">
        <mat-icon>add_circle</mat-icon>
        {{ ('DATA_MODEL.NODE.CREATE_TITLE' | translate)() }}
      </button>
      <button mat-menu-item (click)="addExistingNode()">
        <mat-icon>folder_open</mat-icon>
        {{ ('DATA_MODEL.MODELER.ACTIONS.ADD_EXISTING_NODE_LABEL' | translate)() }}
      </button>
    </mat-menu>
  `,
  imports: [MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatTooltip, TranslatePipe],
})
export class DataModelerAddActionComponent {
  private state = inject(DataModelerDiagramState);
  private dialogs = inject(DataModelerDialogService);
  private store = inject(DataModelStore);
  private destroyRef = inject(DestroyRef);

  createNode(): void {
    const existingNames = this.store.nodes().map(n => n.name);

    this.dialogs.openCreateNodeDialog(existingNames).pipe(
      filter((name): name is string => name !== null),
      switchMap(name =>
        this.state.withLoading(this.store.createNode({ name, nodeId: null }))
          .pipe(tap(modification => this.state.addNodeToDiagram(modification.updatedNodes[0]))),
      ),
      catchError(() => {
        this.dialogs.openCreationErrorDialog();
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  addExistingNode(): void {
    this.dialogs.openAddExistingNode(this.state.getAvailableNodes()).pipe(
      filter(node => node !== null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(node => this.state.addNodeToDiagram(node));
  }
}
