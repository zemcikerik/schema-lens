import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TextDialogComponent, TextDialogData } from '../shared/components/text-dialog/text-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private matDialog = inject(MatDialog);

  openConfirmationDialog(
    titleKey: string,
    descriptionKey: string,
    type: 'classic' | 'danger' = 'classic'
  ): Observable<boolean | null> {
    const data: ConfirmationDialogData = { titleKey, descriptionKey, type };

    return this.matDialog.open(ConfirmationDialogComponent, { data }).afterClosed().pipe(
      map(result => result ?? null),
    );
  }

  openTextDialog(titleKey: string, descriptionKey: string): void {
    const data: TextDialogData = { titleKey, descriptionKey };
    this.matDialog.open(TextDialogComponent, { data });
  }

}
