import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TrapClicksDirective } from '../../../core/directives/trap-clicks.directive';
import { FocusLeftDirective } from '../../../core/directives/focus-left.directive';
import { catchError, concat, filter, of, switchMap } from 'rxjs';
import { DataModelerState } from '../data-modeler.state';
import { DataModelerDiagramState } from '../data-modeler-diagram.state';
import { DataModelerDialogService } from '../data-modeler-dialog.service';
import { DataModelerEditorResolverService } from './data-modeler-editor-resolver.service';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-properties-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'data-modeler-properties-host.component.html',
  imports: [
    LayoutHeaderAndContentComponent,
    ContentCardComponent,
    CdkTrapFocus,
    TrapClicksDirective,
    FocusLeftDirective,
    TranslatePipe,
  ],
})
export class DataModelerPropertiesHostComponent {
  private dialogs = inject(DataModelerDialogService);
  private state = inject(DataModelerState);
  private diagramState = inject(DataModelerDiagramState);
  private editorResolver = inject(DataModelerEditorResolverService);
  private destroyRef = inject(DestroyRef);

  editorTarget = viewChild.required('editorTarget', { read: ViewContainerRef });

  private currentRef = signal<ComponentRef<DataModelEditor> | null>(null);
  formInvalid = signal<boolean>(false);

  private editorKind = computed(() => this.editorResolver.editorKind(this.state.currentSelection()));
  titleKey = computed(() => this.editorResolver.editorTitleKey(this.state.currentSelection()));

  constructor() {
    this.recreateEditorOnKindChange();
    this.trackFormValidity();
    this.disableFormWhenBusy();
    this.destroyRef.onDestroy(() => this.currentRef()?.destroy());
  }

  private recreateEditorOnKindChange(): void {
    toObservable(this.editorKind)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentRef()?.destroy();
        this.currentRef.set(this.editorResolver.createEditor(this.state.currentSelection, this.editorTarget()));
      });
  }

  private trackFormValidity(): void {
    toObservable(this.currentRef)
      .pipe(
        switchMap(ref => {
          const form = ref?.instance.form;
          return form ? concat(of(form.status), form.statusChanges) : of('VALID' as const);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(status => this.formInvalid.set(status === 'INVALID'));
  }

  private disableFormWhenBusy(): void {
    effect(() => {
      const form = this.currentRef()?.instance.form;

      if (!form) {
        return;
      }

      if (this.state.loading()) {
        form.disable({ emitEvent: false });
      } else {
        form.enable({ emitEvent: false });
      }
    });
  }

  notifyUserOfInvalidForm(): void {
    this.currentRef()?.instance.form?.markAllAsTouched();
    this.dialogs.openInvalidPropertiesDialog();
  }

  saveChanges(): void {
    if (this.formInvalid() || this.state.loading()) {
      return;
    }

    const save$ = this.currentRef()?.instance.save();

    if (!save$) {
      return;
    }

    this.state
      .withLoading(save$)
      .pipe(
        catchError(() => {
          this.dialogs.openCreationErrorDialog();
          return of(null);
        }),
        filter(modification => modification !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(modification => this.diagramState.applyModification(modification));
  }
}
