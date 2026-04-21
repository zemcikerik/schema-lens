import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../core/dialog.service';
import { DataModelerComponent } from './data-modeler.component';

export const dataModelerUnsavedGuard: CanDeactivateFn<DataModelerComponent> = (component): boolean | Observable<boolean> => {
  if (!component.state.hasUnsavedPositions()) {
    return true;
  }

  return inject(DialogService)
    .openConfirmationDialog(
      'DATA_MODEL.MODELER.DIALOGS.UNSAVED_CHANGES.TITLE',
      'DATA_MODEL.MODELER.DIALOGS.UNSAVED_CHANGES.DESCRIPTION',
      'danger',
    )
    .pipe(map(result => !!result));
};
