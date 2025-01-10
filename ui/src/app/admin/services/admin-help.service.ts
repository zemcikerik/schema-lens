import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminCreateFaqPost, AdminFaqPost } from '../models/admin-faq-post.model';
import { AdminHelpHttpClientService } from './admin-help-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class AdminHelpService {

  private adminHelpHttpClient = inject(AdminHelpHttpClientService);

  getFaqPosts(): Observable<AdminFaqPost[]> {
    return this.adminHelpHttpClient.getFaqPosts();
  }

  createFaqPost(post: AdminCreateFaqPost): Observable<AdminFaqPost> {
    return this.adminHelpHttpClient.createFaqPost(post);
  }

  updateFaqPost(post: AdminFaqPost): Observable<AdminFaqPost> {
    const { title, answer } = post;
    return this.adminHelpHttpClient.updateFaqPost(post.id, { title, answer });
  }

  deleteFaqPost(id: number): Observable<unknown> {
    return this.adminHelpHttpClient.deleteFaqPost(id);
  }

}
