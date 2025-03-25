
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'billing' | 'features' | 'account' | 'technical';
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMethod {
  id: string;
  type: 'email' | 'phone' | 'chat' | 'social';
  value: string;
  description: string;
  availableHours?: string;
}
