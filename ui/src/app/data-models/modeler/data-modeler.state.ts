import { Injectable, signal } from '@angular/core';
import { catchError, defer, finalize, Observable, throwError } from 'rxjs';
import { SchemaDiagramSelection } from '../../diagrams/schema/model/schema-diagram-selection.model';

@Injectable()
export class DataModelerState {
  private _currentSelection = signal<SchemaDiagramSelection | null>(null);
  private _connectMode = signal<boolean>(false);
  private _loading = signal<boolean>(false);

  currentSelection = this._currentSelection.asReadonly();
  connectMode = this._connectMode.asReadonly();
  loading = this._loading.asReadonly();

  setCurrentSelection(selection: SchemaDiagramSelection | null): void {
    this._currentSelection.set(selection);
  }

  clearCurrentSelection(): void {
    this._currentSelection.set(null);
  }

  setConnectMode(active: boolean): void {
    this._connectMode.set(active);
  }

  disableConnectMode(): void {
    this._connectMode.set(false);
  }

  withLoading<T>(observable: Observable<T>): Observable<T> {
    return defer(() => {
      this._loading.set(true);
      return observable.pipe(
        catchError(err => {
          console.error(err);
          return throwError(() => err);
        }),
        finalize(() => this._loading.set(false)),
      );
    });
  }
}
