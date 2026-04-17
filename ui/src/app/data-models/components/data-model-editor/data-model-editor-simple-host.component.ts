import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  inputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataModelEditor } from './data-model-editor.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { SaveDeleteControlComponent } from '../../../shared/components/save-delete-control/save-delete-control.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, map, mergeMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DataModelStore } from '../../data-model.store';
import { DataModelEditorSimpleHostConfig } from './data-model-editor-simple-host.config';

@Component({
  selector: 'app-data-model-editor-simple-host',
  templateUrl: './data-model-editor-simple-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DataModelingTranslatePipe,
    LayoutHeaderAndContentComponent,
    SaveDeleteControlComponent,
    TranslatePipe,
  ],
})
export class DataModelEditorSimpleHostComponent<O, E extends DataModelEditor> {
  config = input.required<DataModelEditorSimpleHostConfig<O, E>>();
  currentRawObjectId = input.required<string>();

  objectResolver = computed(() => this.config().objectResolver);
  objectId = computed(() => +this.currentRawObjectId());
  currentObject = computed<O | null>(() => {
    const objectId = this.objectId();
    return isNaN(objectId) ? null : this.objectResolver()(objectId);
  });

  editorHost = viewChild('editorHost', { read: ViewContainerRef });
  currentEditorRef: ComponentRef<E> | null = null;

  updateLoading = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  loading = computed<boolean>(() => this.updateLoading() || this.deleteLoading());
  error = signal<boolean>(false);

  private store = inject(DataModelStore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const configWithHost = computed(() => ({
      ...this.config(),
      editorHost: this.editorHost(),
    }));

    toObservable(configWithHost)
      .pipe(
        tap(() => this.currentEditorRef?.destroy()),
        filter(config => !!config.editorHost),
        map(config => {
          const objectBinding = inputBinding(config.objectInputPropertyKey, this.currentObject);
          const bindings = [objectBinding];
          return config.editorHost?.createComponent(config.editorComponent, { bindings }) ?? null;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(ref => (this.currentEditorRef = ref));

    effect(() => {
      if (this.currentObject() === null) {
        this.redirectOnObjectNotExisting();
      }
    });

    effect(() => {
      const form = this.currentEditorRef?.instance.form;

      if (this.loading()) {
        form?.disable({ emitEvent: false });
      } else {
        form?.enable({ emitEvent: false });
      }
    });
  }

  save(): void {
    const save$ = this.currentEditorRef?.instance.save();

    if (!save$) {
      return;
    }

    this.updateLoading.set(true);
    this.error.set(false);

    save$
      .pipe(
        tap({ error: () => this.error.set(true) }),
        finalize(() => this.updateLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  delete(): void {
    const config = this.config();
    const objectId = this.objectId();

    config
      .deleteConfirmationOpener()
      .pipe(
        filter(result => !!result),
        tap(() => {
          this.deleteLoading.set(true);
          this.error.set(false);
        }),
        mergeMap(() => config.objectDeleter(objectId)),
        tap({ error: () => this.error.set(true) }),
        finalize(() => this.deleteLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(async () => {
        this.redirectOnObjectNotExisting();
      });
  }

  redirectOnObjectNotExisting(): void {
    void this.router.navigate(['/model', this.store.dataModelId]);
  }
}
