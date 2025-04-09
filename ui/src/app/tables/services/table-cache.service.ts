import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableCacheService {

  private _invalidateTable$ = new Subject<{ projectId: string, tableName: string }>();
  readonly invalidateTable$ = this._invalidateTable$.asObservable();

  invalidateTable(projectId: string, tableName: string): void {
    this._invalidateTable$.next({ projectId, tableName });
  }

}
