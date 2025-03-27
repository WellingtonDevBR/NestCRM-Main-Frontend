
import React from "react";
import { InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MappingHelpAccordion: React.FC = () => {
  return (
    <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>The Mapping Process</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-purple-50/50 dark:bg-purple-900/10 px-6 py-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full w-6 h-6 mt-0.5 text-purple-600 dark:text-purple-400 text-sm font-medium">1</div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">Start with our <span className="font-medium">Lightweight Model</span> (requires fewer fields) or go for higher accuracy with the <span className="font-medium">Full Model</span>.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full w-6 h-6 mt-0.5 text-purple-600 dark:text-purple-400 text-sm font-medium">2</div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">For each required model field (like "Age" or "Gender"):</p>
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-600 dark:text-gray-400">
                      <li>Select the appropriate field category</li>
                      <li>Choose a matching field from your data</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full w-6 h-6 mt-0.5 text-purple-600 dark:text-purple-400 text-sm font-medium">3</div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">Make sure your fields match the expected type:</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm font-medium">Numbers</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm font-medium">Dropdowns</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        <span className="text-sm font-medium">Dates</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full w-6 h-6 mt-0.5 text-purple-600 dark:text-purple-400 text-sm font-medium">4</div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">Once complete, click <span className="font-medium">Save</span> — and you're ready to start predicting churn with real customer data!</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="p-4 border-t border-border dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 flex items-center gap-2 text-sm">
        <InfoIcon className="h-4 w-4" />
        <span>Tip: Not sure what a field means? Hover over it for a tooltip with a description.</span>
      </div>
    </div>
  );
};

export default MappingHelpAccordion;
