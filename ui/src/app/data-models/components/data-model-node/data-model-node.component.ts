import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { DataModelStore } from '../../data-model.store';
import { Router } from '@angular/router';
import { DataModelNodeEditorComponent } from '../data-model-node-editor/data-model-node-editor.component';
import {
  SaveDeleteControlComponent
} from '../../../shared/components/save-delete-control/save-delete-control.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataModelDialogService } from '../../services/data-model-dialog.service';
import { filter, finalize, mergeMap, tap } from 'rxjs';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';

@Component({
  selector: 'app-data-model-node',
  templateUrl: 'data-model-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataModelNodeEditorComponent, SaveDeleteControlComponent, LayoutHeaderAndContentComponent, DataModelingTranslatePipe],
})
export class DataModelNodeComponent {
  nodeId = input.required<string>();

  node = computed(() => {
    const nodeId = +this.nodeId();
    const node = this.store.nodes().find(n => n.nodeId === nodeId);

    if (node) {
      return node;
    }

    this.redirectToModel();
    return null;
  });

  updateLoading = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  loading = computed<boolean>(() => this.updateLoading() || this.deleteLoading());
  error = signal<boolean>(false);
  editor = viewChild.required(DataModelNodeEditorComponent);

  private store = inject(DataModelStore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DataModelDialogService);

  updateNode(): void {
    const save$ = this.editor().save();

    if (save$ === null) {
      return;
    }

    this.updateLoading.set(true);
    this.error.set(false);

    save$.pipe(
      tap({ error: () => this.error.set(true) }),
      finalize(() => this.updateLoading.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  deleteNode(): void {
    const nodeId = this.node()?.nodeId;

    if (!nodeId) {
      return;
    }

    this.dialogService
      .openDeleteNodeConfirmationDialog()
      .pipe(
        filter(result => !!result),
        tap(() =>{
          this.deleteLoading.set(true);
          this.error.set(false);
        }),
        mergeMap(() => this.store.deleteNode(nodeId)),
        tap({ error: () => this.error.set(true), }),
        finalize(() => this.deleteLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(async () => {
        await this.redirectToModel();
      });
  }

  private async redirectToModel(): Promise<void> {
    await this.router.navigate(['/model', this.store.dataModelId]);
  }
}
