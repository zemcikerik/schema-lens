import { CanDeactivateFn } from '@angular/router';
import { LogicalDataModelerComponent } from './logical-data-modeler.component';
import { dataModelerUnsavedGuard } from '../data-modeler-unsaved.guard';

export const logicalDataModelerUnsavedGuard: CanDeactivateFn<LogicalDataModelerComponent> = component => {
  const dataModeler = component.dataModeler();
  return dataModeler ? dataModelerUnsavedGuard(dataModeler, 'LOGICAL') : true;
};
