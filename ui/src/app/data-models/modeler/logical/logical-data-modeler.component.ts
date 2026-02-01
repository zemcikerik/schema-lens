import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { DataModelerComponent } from '../data-modeler.component';
import { LogicalDataModelingModule } from './logical-data-modeling.module';
import { DATA_MODELER_DEFINITION } from '../data-modeler.definition';
import { LogicalDataModelerDefinition } from './logical-data-modeler.definition';
import { DATA_MODELING_FACADE } from '../data-modeling.facade';
import { LogicalDataModelingFacade } from './logical-data-modeling.facade';

@Component({
  selector: 'app-logical-data-modeler',
  template: '<app-data-modeler />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LogicalDataModelingModule,
    DataModelerComponent
  ],
  providers: [
    { provide: DATA_MODELER_DEFINITION, useExisting: LogicalDataModelerDefinition },
    { provide: DATA_MODELING_FACADE, useExisting: LogicalDataModelingFacade },
  ],
})
export class LogicalDataModelerComponent {
  dataModeler = viewChild.required(DataModelerComponent);
}
