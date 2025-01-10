import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileHttpClientService } from './profile-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private profileHttpClient = inject(ProfileHttpClientService);

  updateProfilePicture(file: File): Observable<boolean> {
    return this.profileHttpClient.updateProfilePicture(file);
  }

}
