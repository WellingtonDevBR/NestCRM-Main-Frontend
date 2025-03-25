
import { FaqItem, KnowledgeBaseArticle, ContactMethod } from "@/domain/models/helpAndSupport";

// Mock data for FAQs
const mockFaqs: FaqItem[] = [
  {
    id: "faq-001",
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive an email with instructions to create a new password.",
    category: "account"
  },
  {
    id: "faq-002",
    question: "How are subscriptions billed?",
    answer: "Subscriptions are billed on a monthly or annual basis, depending on the plan you select. Payment is processed automatically using your saved payment method.",
    category: "billing"
  },
  {
    id: "faq-003",
    question: "Can I export customer data?",
    answer: "Yes, you can export customer data in CSV, Excel, or JSON formats from the Customers page. Click on the 'Export' button in the top right corner and select your preferred format.",
    category: "features"
  },
  {
    id: "faq-004",
    question: "How do I add a new user to my account?",
    answer: "You can add new users by going to Settings > Team Management > Add User. You will need to specify their email address and permission level.",
    category: "account"
  },
  {
    id: "faq-005",
    question: "What happens if I exceed my plan limits?",
    answer: "If you exceed your plan limits, you'll receive a notification. You can continue using the service, but some features may be limited until you upgrade your plan or reduce usage.",
    category: "billing"
  },
  {
    id: "faq-006",
    question: "How secure is my data?",
    answer: "We use industry-standard encryption and security measures to protect your data. All information is stored in secure data centers with 24/7 monitoring.",
    category: "technical"
  },
  {
    id: "faq-007",
    question: "How do I integrate with other services?",
    answer: "You can integrate with other services through our API or using our pre-built integrations. Go to Settings > Integrations to view available options and setup instructions.",
    category: "features"
  }
];

// Mock data for Knowledge Base articles
const mockKnowledgeBase: KnowledgeBaseArticle[] = [
  {
    id: "kb-001",
    title: "Getting Started with NestCRM",
    summary: "Learn the basics of setting up and using NestCRM",
    content: "This is a placeholder for the full article content about getting started with NestCRM.",
    category: "Basics",
    tags: ["setup", "onboarding", "introduction"],
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2023-12-15T14:30:00Z"
  },
  {
    id: "kb-002",
    title: "Advanced Customer Segmentation",
    summary: "Learn how to use the advanced segmentation features",
    content: "This is a placeholder for the full article content about advanced customer segmentation.",
    category: "Advanced Features",
    tags: ["segmentation", "customers", "advanced"],
    createdAt: "2023-11-05T09:15:00Z",
    updatedAt: "2024-01-10T11:20:00Z"
  },
  {
    id: "kb-003",
    title: "Setting Up Payment Integrations",
    summary: "Step-by-step guide to integrating payment processors",
    content: "This is a placeholder for the full article content about payment integrations.",
    category: "Integrations",
    tags: ["payments", "setup", "integration"],
    createdAt: "2023-12-01T16:45:00Z",
    updatedAt: "2023-12-20T13:10:00Z"
  }
];

// Mock data for contact methods
const mockContactMethods: ContactMethod[] = [
  {
    id: "contact-001",
    type: "email",
    value: "support@nestcrm.com",
    description: "For general inquiries and support requests",
    availableHours: "24/7"
  },
  {
    id: "contact-002",
    type: "phone",
    value: "+1 (555) 123-4567",
    description: "Customer support hotline",
    availableHours: "Mon-Fri, 9AM-5PM EST"
  },
  {
    id: "contact-003",
    type: "chat",
    value: "Live Chat",
    description: "Chat with a support representative directly from the app",
    availableHours: "Mon-Fri, 8AM-8PM EST"
  }
];

export const helpAndSupportService = {
  // Fetch all FAQs
  getFaqs: async (): Promise<FaqItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFaqs), 800);
    });
  },

  // Fetch FAQs by category
  getFaqsByCategory: async (category: FaqItem['category']): Promise<FaqItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredFaqs = mockFaqs.filter(faq => faq.category === category);
        resolve(filteredFaqs);
      }, 500);
    });
  },

  // Fetch all Knowledge Base articles
  getKnowledgeBaseArticles: async (): Promise<KnowledgeBaseArticle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockKnowledgeBase), 800);
    });
  },

  // Fetch Knowledge Base article by ID
  getKnowledgeBaseArticleById: async (id: string): Promise<KnowledgeBaseArticle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = mockKnowledgeBase.find(article => article.id === id);
        resolve(article);
      }, 500);
    });
  },

  // Fetch all contact methods
  getContactMethods: async (): Promise<ContactMethod[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockContactMethods), 500);
    });
  }
};
