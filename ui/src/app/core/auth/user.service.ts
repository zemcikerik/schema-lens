import { inject, Injectable } from '@angular/core';
import { ChangePassword } from '../models/change-password.model';
import { Observable } from 'rxjs';
import { UserHttpClientService } from './user-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userHttpClient = inject(UserHttpClientService);

  updatePassword(data: ChangePassword): Observable<boolean> {
    return this.userHttpClient.updatePassword(data);
  }

  deleteUser(): Observable<unknown> {
    return this.userHttpClient.deleteUser();
  }

}
