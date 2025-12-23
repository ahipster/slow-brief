export interface CandidateSection {
  title: string;
  subsections: string[];
}

export interface CandidateInput {
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  toc: string[];
  sections: CandidateSection[];
  publishDate: string | null;
}

export interface CandidateRecord {
  id: string;
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  toc: string[];
  sections: CandidateSection[];
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
  toc: string[];
  sections: CandidateSection[];
  publishDate: string;
  status: 'published';
  updatedAt: string;
}
