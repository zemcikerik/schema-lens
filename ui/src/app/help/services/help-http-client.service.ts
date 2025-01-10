import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FaqPost } from '../models/faq-post.model';

@Injectable({
  providedIn: 'root',
})
export class HelpHttpClientService {

  private httpClient = inject(HttpClient);

  getFaqPosts(locale: string): Observable<FaqPost[]> {
    return this.httpClient.get<FaqPost[]>(`/help/faq/${locale}`);
  }

}
