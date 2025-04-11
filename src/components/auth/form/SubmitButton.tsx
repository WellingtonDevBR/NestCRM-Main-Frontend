
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children?: React.ReactNode;
  className?: string;
}

const SubmitButton = ({ 
  isLoading, 
  loadingText = "Creating account...", 
  children,
  className
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full bg-primary hover:opacity-90 transition-all h-11 font-medium",
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{children || "Create account"}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </Button>
  );
};

export default SubmitButton;
