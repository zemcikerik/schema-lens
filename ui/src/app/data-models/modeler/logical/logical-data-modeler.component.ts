import { afterNextRender, ChangeDetectionStrategy, Component, inject, Injector, input, viewChild } from '@angular/core';
import { DataModelerComponent } from '../data-modeler.component';
import { LogicalDataModelingModule } from './logical-data-modeling.module';
import { DATA_MODELER_DEFINITION } from '../data-modeler.definition';
import { LogicalDataModelerDefinition } from './logical-data-modeler.definition';
import { DATA_MODELING_FACADE } from '../data-modeling.facade';
import { LogicalDataModelingFacade } from './logical-data-modeling.facade';
import { LogicalModelStore } from './logical-model.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-logical-data-modeler',
  template: `
    @if (store.loading()) {
      <mat-progress-bar />
    } @else if (store.error()) {
      <app-alert type="error">{{ ('GENERIC.ERROR_LABEL' | translate)() }}</app-alert>
    } @else {
      <app-data-modeler [backLink]="'/model/' + dataModelId()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LogicalDataModelingModule,
    DataModelerComponent,
    MatProgressBar,
    AlertComponent,
    TranslatePipe,
  ],
  providers: [
    LogicalModelStore,
    { provide: DATA_MODELER_DEFINITION, useExisting: LogicalDataModelerDefinition },
    { provide: DATA_MODELING_FACADE, useExisting: LogicalDataModelingFacade },
  ],
})
export class LogicalDataModelerComponent {
  dataModelId = input.required<string>();
  diagramId = input.required<string>();
  dataModeler = viewChild(DataModelerComponent);

  store = inject(LogicalModelStore);
  private facade = inject(LogicalDataModelingFacade);

  constructor() {
    const injector = inject(Injector);
    // TODO: conversions
    toObservable(this.dataModelId).pipe(
      switchMap(() => this.store.loadModel(+this.dataModelId())),
      switchMap(() => this.store.loadDiagram(+this.diagramId())),
      takeUntilDestroyed(),
    ).subscribe(() => afterNextRender({
      mixedReadWrite: () => this.facade.initDiagram(),
    }, { injector }));
  }
}
