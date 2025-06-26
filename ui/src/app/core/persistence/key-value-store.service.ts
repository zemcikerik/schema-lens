import { inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage.token';

@Injectable({ providedIn: 'root' })
export class KeyValueStoreService {

  private localStorage = inject(LOCAL_STORAGE);

  hasString(key: string): boolean {
    return this.localStorage.getItem(key) !== null;
  }

  getString(key: string): string | null {
    return this.localStorage.getItem(key);
  }

  setString(key: string, value: string): void {
    this.localStorage.setItem(key, value);
  }

  removeString(key: string): void {
    this.localStorage.removeItem(key);
  }

}
