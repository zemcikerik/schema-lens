import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminCreateFaqPost, AdminFaqPost, AdminUpdateFaqPost } from '../models/admin-faq-post.model';

@Injectable({
  providedIn: 'root',
})
export class AdminHelpHttpClientService {

  private httpClient = inject(HttpClient);

  getFaqPosts(): Observable<AdminFaqPost[]> {
    return this.httpClient.get<AdminFaqPost[]>('/admin/help/faq');
  }

  createFaqPost(post: AdminCreateFaqPost): Observable<AdminFaqPost> {
    return this.httpClient.post<AdminFaqPost>('/admin/help/faq', post);
  }

  updateFaqPost(id: number, post: AdminUpdateFaqPost): Observable<AdminFaqPost> {
    return this.httpClient.put<AdminFaqPost>(`/admin/help/faq/${id}`, post);
  }

  deleteFaqPost(id: number): Observable<unknown> {
    return this.httpClient.delete(`/admin/help/faq/${id}`);
  }

}
