import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(username: string, password: string): Observable<boolean> {
    return of(Math.random() < 0.5).pipe(delay(2000));
  }

}
