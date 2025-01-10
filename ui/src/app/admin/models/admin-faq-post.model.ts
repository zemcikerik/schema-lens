export interface AdminFaqPost {
  id: number;
  locale: string;
  title: string;
  answer: string;
}

export type AdminCreateFaqPost = Exclude<AdminFaqPost, 'id'>;
export type AdminUpdateFaqPost = Pick<AdminFaqPost, 'title' | 'answer'>;
