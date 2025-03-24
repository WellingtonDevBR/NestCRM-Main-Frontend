
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Database, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CustomFieldsHeader: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-8 w-8">
            <Link to="/settings">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold">Customer Data Fields</h1>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 ml-12">Customize what information you collect about your customers</p>
      <Separator className="mt-6" />
    </div>
  );
};

export default CustomFieldsHeader;
