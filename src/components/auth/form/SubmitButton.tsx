
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
}

const SubmitButton = ({ isLoading, loadingText = "Creating account..." }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full button-gradient"
      disabled={isLoading}
    >
      {isLoading ? loadingText : "Create account"}
    </Button>
  );
};

export default SubmitButton;
