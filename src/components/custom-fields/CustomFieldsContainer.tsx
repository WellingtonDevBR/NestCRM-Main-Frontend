
import React from "react";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomFieldsContainerProps {
  children: React.ReactNode;
}

const CustomFieldsContainer: React.FC<CustomFieldsContainerProps> = ({ children }) => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          Field Customization
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Define additional fields to collect from your customers. These will appear in customer forms and tables.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <CardDescription>Add the custom data fields you need to collect from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomFieldsContainer;
