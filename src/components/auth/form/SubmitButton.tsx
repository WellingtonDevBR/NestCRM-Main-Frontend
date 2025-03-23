
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full button-gradient"
      disabled={isLoading}
    >
      {isLoading ? "Creating account..." : "Create account"}
    </Button>
  );
};

export default SubmitButton;
