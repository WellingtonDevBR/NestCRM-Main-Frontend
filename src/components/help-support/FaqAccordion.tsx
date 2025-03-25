
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqItem } from "@/domain/models/helpAndSupport";

interface FaqAccordionProps {
  faqs: FaqItem[];
  categoryTitle: string;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs, categoryTitle }) => {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{categoryTitle}</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-1 text-muted-foreground">
                {faq.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqAccordion;
