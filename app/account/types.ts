export interface CandidateInput {
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  publishDate: string | null;
}

export interface CandidateRecord {
  id: string;
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  publishDate: string | null;
  status: 'candidate' | 'scheduled' | 'published';
  updatedAt: string;
}

export interface PublishedBriefRecord {
  id: string;
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  publishDate: string;
  status: 'published';
  updatedAt: string;
}
