import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  inject,
  input,
  inputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { SchemaDiagramSelection } from '../../../diagrams/schema/model/schema-diagram-selection.model';
import { DATA_MODELER_DEFINITION } from '../data-modeler.definition';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { DataModelerTranslatePipe } from '../data-modeler-translate.pipe';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BaseDataModelerPropertiesComponent } from './base-data-modeler-properties.component';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TrapClicksDirective } from '../../../core/directives/trap-clicks.directive';
import { concat, filter, map, of, switchMap, tap } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';
import { DATA_MODELING_FACADE } from '../data-modeling.facade';

@Component({
  selector: 'app-data-modeler-properties-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-card
      class="data-modeler__properties"
      [background]="'dim'"
      [cdkTrapFocus]="formInvalid()"
      [appTrapClicks]="formInvalid()"
      (clickTrapped)="notifyUserOfInvalidForm()"
      (focusout)="saveChanges()"
    >
      <app-layout-header-and-content [title]="('DATA_MODELER.$type.PROPERTIES.TITLE' | dataModelerTranslate)()"
                                     [titleLevel]="'low'">
        <ng-container #propertiesTarget />
      </app-layout-header-and-content>
    </app-content-card>
  `,
  imports: [
    LayoutHeaderAndContentComponent,
    DataModelerTranslatePipe,
    ContentCardComponent,
    CdkTrapFocus,
    TrapClicksDirective,
  ],
})
export class DataModelerPropertiesHostComponent {
  private definition = inject(DATA_MODELER_DEFINITION);
  private dialogService = inject(DialogService);
  private facade = inject(DATA_MODELING_FACADE);

  selection = input.required<SchemaDiagramSelection | null>();
  propertiesTarget = viewChild.required('propertiesTarget', { read: ViewContainerRef });
  propertiesComponentType = computed(() => this.definition.getPropertiesComponentFor(this.selection()));

  private currentRef = signal<ComponentRef<BaseDataModelerPropertiesComponent> | undefined>(undefined);
  formInvalid = signal<boolean>(false);

  constructor() {
    this.renderPropertiesComponentBasedOnSelection();
    this.trackPropertiesFormValidity();
    this.disableFormWhenModelIsBeingUpdated();
    this.destroyPropertiesComponentWhenHostIsDestroyed();
  }

  private renderPropertiesComponentBasedOnSelection(): void {
    toObservable(this.propertiesComponentType).pipe(
      tap(() => this.currentRef()?.destroy()),
      map(propertiesType => this.propertiesTarget().createComponent(propertiesType, {
        bindings: [inputBinding('selection', this.selection)],
      })),
      takeUntilDestroyed(),
    ).subscribe(componentRef => this.currentRef.set(componentRef));
  }

  private trackPropertiesFormValidity(): void {
    toObservable(this.currentRef).pipe(
      map(componentRef => componentRef?.instance?.propertiesForm),
      filter(form => !!form),
      switchMap(form => concat(of(form.status), form.statusChanges)),
      takeUntilDestroyed(),
    ).subscribe(status => this.formInvalid.set(status === 'INVALID'));
  }

  private disableFormWhenModelIsBeingUpdated(): void {
    toObservable(this.facade.loading).pipe(takeUntilDestroyed()).subscribe(loading => {
      const form = this.currentRef()?.instance?.propertiesForm;

      if (loading) {
        form?.disable({ emitEvent: false });
      } else {
        form?.enable({ emitEvent: false });
      }
    });
  }

  private destroyPropertiesComponentWhenHostIsDestroyed(): void {
    inject(DestroyRef).onDestroy(() => this.currentRef()?.destroy());
  }

  notifyUserOfInvalidForm(): void {
    this.currentRef()?.instance.propertiesForm?.markAllAsTouched();
    this.dialogService.openTextDialog(
      'DATA_MODELER.GENERIC.DIALOGS.PROPERTIES_INVALID_TITLE',
      'DATA_MODELER.GENERIC.DIALOGS.PROPERTIES_INVALID_DESCRIPTION',
    );
  }

  saveChanges(): void {
    if (!this.formInvalid()) {
      this.currentRef()?.instance.saveChanges();
    }
  }
}
