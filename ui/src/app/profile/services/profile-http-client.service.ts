import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class ProfileHttpClientService {

  private httpClient = inject(HttpClient);

  updateProfilePicture(file: File): Observable<boolean> {
    const formData = new FormData();
    formData.set('profilePicture', file);

    return this.httpClient.post('/user/profile-picture', formData).pipe(
      map(() => true),
      catchSpecificHttpStatusError(400, () => of(false)),
      catchSpecificHttpStatusError(413, () => of(false)),
    );
  }

}
