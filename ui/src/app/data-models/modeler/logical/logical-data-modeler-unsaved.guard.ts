import { CanDeactivateFn } from '@angular/router';
import { LogicalDataModelerComponent } from './logical-data-modeler.component';
import { dataModelerUnsavedGuard } from '../data-modeler-unsaved.guard';

export const logicalDataModelerUnsavedGuard: CanDeactivateFn<LogicalDataModelerComponent> = component => {
  return dataModelerUnsavedGuard(component.dataModeler(), 'LOGICAL');
};
