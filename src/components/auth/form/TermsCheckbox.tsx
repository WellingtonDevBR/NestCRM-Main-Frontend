
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TermsCheckbox = () => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" required />
      <Label htmlFor="terms" className="text-sm">
        I agree to the{" "}
        <a href="#" className="text-primary hover:text-primary/80">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:text-primary/80">
          Privacy Policy
        </a>
      </Label>
    </div>
  );
};

export default TermsCheckbox;
