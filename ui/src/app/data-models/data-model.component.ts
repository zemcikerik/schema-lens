import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../shared/components/content-card/content-card.component';
import { DataModelNavComponent } from './components/data-model-nav/data-model-nav.component';
import { Router, RouterOutlet } from '@angular/router';
import { LogicalDataModelService } from './services/logical-data-model.service';
import { tap } from 'rxjs';
import { ProgressSpinnerComponent } from '../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { TranslatePipe } from '../core/translate/translate.pipe';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LogicalEntityService } from './services/logical-entity.service';
import { ChangedReason, DataTypeService } from './services/data-type.service';
import { DataModelDiagramService } from './services/data-model-diagram.service';

@Component({
  selector: 'app-data-model',
  templateUrl: './data-model.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    DataModelNavComponent,
    RouterOutlet,
    ProgressSpinnerComponent,
    AlertComponent,
    TranslatePipe,
  ],
})
export class DataModelComponent {
  dataModelId = input.required<number>();

  private logicalDataModelService = inject(LogicalDataModelService);
  private logicalEntityService = inject(LogicalEntityService);
  private dataTypeService = inject(DataTypeService);
  private diagramService = inject(DataModelDiagramService);
  private router = inject(Router);

  constructor() {
    this.logicalEntityService.entityUpdated$.pipe(takeUntilDestroyed()).subscribe(entity => {
      const model = structuredClone(this.logicalDataModel());
      if (!model) return;
      const index = model?.entities.findIndex(e => e.entityId === entity.entityId);
      model.entities[index] = entity;
      this.logicalDataModel.set(model);
    });
    this.logicalEntityService.entityDeleted$.pipe(takeUntilDestroyed()).subscribe(entityId => {
      const model = structuredClone(this.logicalDataModel());
      if (!model) return;
      const index = model?.entities.findIndex(e => e.entityId === entityId);
      model.entities.splice(index, 1);
      this.logicalDataModel.set(model);
    });
    this.logicalEntityService.entityCreated$.pipe(takeUntilDestroyed()).subscribe(entity => {
      const model = structuredClone(this.logicalDataModel());
      if (!model) return;
      model.entities.push(entity);
      this.logicalDataModel.set(model);
    });

    this.dataTypeService.typeChanged$.pipe(takeUntilDestroyed()).subscribe(args => {
      const model = structuredClone(this.logicalDataModel());
      if (!model) return;
      const index = model?.dataTypes.findIndex(t => t.typeId === args.type.typeId);
      if (args.reason === ChangedReason.CREATE) model?.dataTypes.push(args.type);
      else if (args.reason === ChangedReason.UPDATE) model.dataTypes[index] = args.type;
      else if (args.reason === ChangedReason.DELETE) model.dataTypes.splice(index, 1);
      this.logicalDataModel.set(model);
    });

    this.diagramService.diagramChanged$.pipe(takeUntilDestroyed()).subscribe(args => {
      const model = structuredClone(this.logicalDataModel());
      if (!model) return;
      const index = model?.diagrams.findIndex(t => t.id === args.diagram.id);
      if (args.reason === ChangedReason.CREATE) model?.diagrams.push(args.diagram);
      else if (args.reason === ChangedReason.UPDATE) model.diagrams[index] = args.diagram;
      else if (args.reason === ChangedReason.DELETE) model.diagrams.splice(index, 1);
      this.logicalDataModel.set(model);
    });
  }

  logicalDataModelResource = rxResource({
    params: () => ({ dataModelId: this.dataModelId() }),
    stream: ({ params }) =>
      this.logicalDataModelService.getLogicalDataModel(params.dataModelId).pipe(
        tap(async model => {
          if (model === null) await this.router.navigate(['/404']);
        }),
      ),
  });

  logicalDataModel = linkedSignal(() => this.logicalDataModelResource.value());
}
