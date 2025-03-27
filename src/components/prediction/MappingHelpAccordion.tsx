
import React from "react";
import { HelpCircle, ArrowRight, Check } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

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
        <AccordionContent className="px-4 pb-6">
          <div className="space-y-5 text-sm">
            <p className="text-base">
              Our churn prediction models use specific data points—like a customer's age, spending habits, or subscription type—to 
              predict the likelihood they'll stop using your service.
            </p>
            
            <p className="text-base">
              Since every business stores this data differently, field mapping lets you connect your custom CRM fields to 
              the fields required by our prediction models.
            </p>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-3 text-base">The Mapping Process:</h4>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 bg-purple-200 text-purple-800 rounded-full h-6 w-6 flex items-center justify-center font-semibold">1</div>
                  <div>
                    <p className="font-medium">Choose a Model</p>
                    <p className="text-gray-600 mt-1">Start with our <span className="font-medium">Lightweight Model</span> (requires fewer fields) or go for higher accuracy with the <span className="font-medium">Full Model</span>.</p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="flex-shrink-0 bg-purple-200 text-purple-800 rounded-full h-6 w-6 flex items-center justify-center font-semibold">2</div>
                  <div>
                    <p className="font-medium">Map Your Fields</p>
                    <p className="text-gray-600 mt-1">For each required model field (like "Age" or "Gender"):</p>
                    <ul className="mt-2 space-y-2 ml-2">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>Select the data category (Customer, Order, Payment, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>Choose the specific field from your system that contains this information</span>
                      </li>
                    </ul>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="flex-shrink-0 bg-purple-200 text-purple-800 rounded-full h-6 w-6 flex items-center justify-center font-semibold">3</div>
                  <div>
                    <p className="font-medium">Match Field Types</p>
                    <p className="text-gray-600 mt-1">Make sure your fields match the expected type:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div className="bg-white p-2 rounded border">
                        <span className="text-blue-700 font-medium">Numbers</span> → Age, Spend, Tenure
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-purple-700 font-medium">Dropdowns</span> → Gender, Subscription_Type
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-amber-700 font-medium">Dates</span> → Last_Interaction, Start_Date
                      </div>
                    </div>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="flex-shrink-0 bg-purple-200 text-purple-800 rounded-full h-6 w-6 flex items-center justify-center font-semibold">4</div>
                  <div>
                    <p className="font-medium">Save Your Mapping</p>
                    <p className="text-gray-600 mt-1">Once complete, click <span className="font-medium">Save</span> — and you're ready to start predicting churn with real customer data!</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="text-blue-500 mt-0.5">
                <HelpCircle className="h-5 w-5" />
              </div>
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> Not sure what a field means? Hover over it for a tooltip with a description.
              </p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-600" />
                <span>Example Mapping</span>
              </h4>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-2 font-medium text-gray-600">Model Field</th>
                        <th className="px-4 py-2 font-medium text-gray-600">Your CRM Field</th>
                        <th className="px-4 py-2 font-medium text-gray-600">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2">Age</td>
                        <td className="px-4 py-2 text-purple-600">ClientAge</td>
                        <td className="px-4 py-2"><span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Number</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Gender</td>
                        <td className="px-4 py-2 text-purple-600">Sex</td>
                        <td className="px-4 py-2"><span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-xs font-medium">Select</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Total Spend</td>
                        <td className="px-4 py-2 text-purple-600">LifetimeValue</td>
                        <td className="px-4 py-2"><span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Number</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Subscription Type</td>
                        <td className="px-4 py-2 text-purple-600">PlanStatus</td>
                        <td className="px-4 py-2"><span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-xs font-medium">Select</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MappingHelpAccordion;
