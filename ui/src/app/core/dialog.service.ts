import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TextDialogComponent, TextDialogData } from '../shared/components/text-dialog/text-dialog.component';
import { InputDialogComponent, InputDialogData } from '../shared/components/input-dialog/input-dialog.component';
import { AlertDialogComponent, AlertDialogData } from '../shared/components/error-dialog/error-dialog.component';
import { RestoreFocusValue } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private matDialog = inject(MatDialog);

  openConfirmationDialog(
    titleKey: string,
    descriptionKey: string,
    type: 'classic' | 'danger' = 'classic',
    additionalConfig?: { restoreFocus?: RestoreFocusValue }
  ): Observable<boolean | null> {
    const data: ConfirmationDialogData = { titleKey, descriptionKey, type };
    const restoreFocus = additionalConfig?.restoreFocus;

    return this.matDialog.open(ConfirmationDialogComponent, { data, restoreFocus }).afterClosed().pipe(
      map(result => result ?? null),
    );
  }

  openTextDialog(titleKey: string, descriptionKey: string): void {
    const data: TextDialogData = { titleKey, descriptionKey };
    this.matDialog.open(TextDialogComponent, { data });
  }

  openErrorDialog(titleKey: string, errorKey: string): void {
    const data: AlertDialogData = { titleKey, messageKey: errorKey, type: 'error' };
    this.matDialog.open(AlertDialogComponent, { data });
  }

  openWarningDialog(titleKey: string, messageKey: string): void {
    const data: AlertDialogData = { titleKey, messageKey, type: 'info' };
    this.matDialog.open(AlertDialogComponent, { data });
  }

  openInputDialog(data: InputDialogData): Observable<string | null> {
    return this.matDialog.open(InputDialogComponent, { data }).afterClosed().pipe(
      map(result => result ?? null),
    );
  }
}
