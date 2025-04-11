
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

const SubmitButton = ({ isLoading, loadingText = "Creating account...", children }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full button-gradient"
      disabled={isLoading}
    >
      {isLoading ? loadingText : children || "Create account"}
    </Button>
  );
};

export default SubmitButton;
