
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const MappingHelpAccordion: React.FC = () => {
  return (
    <Accordion type="single" collapsible defaultValue="explanation" className="bg-white border rounded-lg shadow-sm">
      <AccordionItem value="explanation">
        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
          <div className="flex items-center gap-2 font-medium">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            How does field mapping work?
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-3 text-sm">
            <p>
              Our churn prediction model requires specific data points to predict which customers are at risk of churning.
              Through field mapping, you're telling the system which of your custom fields contain that required information.
            </p>
            
            <h4 className="font-medium">The mapping process:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>For each model feature (like "Age" or "Gender"), select the category where that data lives in your system</li>
              <li>Then select the specific field from that category that contains the matching data</li>
              <li>Make sure the field types are compatible (numbers for numeric features, select/dropdown for categorical features)</li>
              <li>Save your mapping when complete</li>
            </ol>
            
            <p>
              You can choose between our Lightweight Model (fewer fields, quicker setup) or Full Model (more fields, higher accuracy).
              We recommend starting with the Lightweight Model and upgrading to the Full Model as needed.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MappingHelpAccordion;
