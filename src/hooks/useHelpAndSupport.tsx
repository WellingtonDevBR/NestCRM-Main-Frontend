
import { useQuery } from "@tanstack/react-query";
import { helpAndSupportService } from "@/services/helpAndSupportService";
import { FaqItem } from "@/domain/models/helpAndSupport";

export const useFaqs = () => {
  const {
    data: faqs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: helpAndSupportService.getFaqs,
  });

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<FaqItem['category'], FaqItem[]>);

  // Ensure all categories exist in the grouping, even if empty
  const allCategories: FaqItem['category'][] = ['general', 'billing', 'features', 'account', 'technical'];
  allCategories.forEach(category => {
    if (!faqsByCategory[category]) {
      faqsByCategory[category] = [];
    }
  });

  return {
    faqs,
    faqsByCategory,
    isLoading,
    error,
  };
};

export const useKnowledgeBase = () => {
  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["knowledge-base"],
    queryFn: helpAndSupportService.getKnowledgeBaseArticles,
  });

  return {
    articles,
    isLoading,
    error,
  };
};

export const useContactMethods = () => {
  const {
    data: contactMethods = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contact-methods"],
    queryFn: helpAndSupportService.getContactMethods,
  });

  return {
    contactMethods,
    isLoading,
    error,
  };
};
