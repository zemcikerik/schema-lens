import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../core/dialog.service';
import { DataModelerComponent } from './data-modeler.component';

export const dataModelerUnsavedGuard: CanDeactivateFn<DataModelerComponent> = (component): boolean | Observable<boolean> => {
  if (!component.hasUnsavedPositions()) {
    return true;
  }

  return inject(DialogService)
    .openConfirmationDialog(
      'Unsaved Changes',
      'You have unsaved layout changes. Are you sure you want to leave?',
      'danger',
    )
    .pipe(map(result => !!result));
};
