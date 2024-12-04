import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private matDialog = inject(MatDialog);

  openConfirmationDialog(titleKey: string, descriptionKey: string): Observable<boolean | null> {
    const data: ConfirmationDialogData = { titleKey, descriptionKey };

    return this.matDialog.open(ConfirmationDialogComponent, { data }).afterClosed().pipe(
      map(result => result ?? null),
    );
  }

}
