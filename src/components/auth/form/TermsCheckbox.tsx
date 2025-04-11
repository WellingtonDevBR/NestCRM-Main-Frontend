
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const TermsCheckbox = () => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" required />
      <Label htmlFor="terms" className="text-sm">
        I agree to the{" "}
        <Link to="/terms-of-service" className="text-primary hover:text-primary/80">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="text-primary hover:text-primary/80">
          Privacy Policy
        </Link>
      </Label>
    </div>
  );
};

export default TermsCheckbox;
