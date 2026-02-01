import { inject } from '@angular/core';
import { DataModelerComponent } from './data-modeler.component';
import { DialogService } from '../../core/dialog.service';
import { map, Observable } from 'rxjs';

export const dataModelerUnsavedGuard = (component: DataModelerComponent, type: string): boolean | Observable<boolean> => {
  if (!component.hasUnsavedPositions()) {
    return true;
  }

  const titleKey = `DATA_MODELER.${type}.DIALOGS.UNSAVED_TITLE`;
  const descriptionKey = `DATA_MODELER.${type}.DIALOGS.UNSAVED_DESCRIPTION`;

  return inject(DialogService).openConfirmationDialog(titleKey, descriptionKey, 'danger').pipe(
    map(result => !!result),
  );
};
