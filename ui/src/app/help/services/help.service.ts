import { inject, Injectable } from '@angular/core';
import { HelpHttpClientService } from './help-http-client.service';
import { Observable } from 'rxjs';
import { FaqPost } from '../models/faq-post.model';

@Injectable({
  providedIn: 'root',
})
export class HelpService {

  private helpHttpClient = inject(HelpHttpClientService);

  getFaqPosts(locale: string): Observable<FaqPost[]> {
    return this.helpHttpClient.getFaqPosts(locale);
  }

}
