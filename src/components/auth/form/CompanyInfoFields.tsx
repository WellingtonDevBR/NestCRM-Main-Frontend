
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircle } from "lucide-react";

interface CompanyInfoFieldsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  subdomain: string;
  setSubdomain: (value: string) => void;
}

const CompanyInfoFields = ({
  companyName,
  setCompanyName,
  subdomain,
  setSubdomain,
}: CompanyInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company">Company name</Label>
        <Input
          id="company"
          name="company"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <div className="flex items-center">
          <Input
            id="subdomain"
            name="subdomain"
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
            className="bg-gray-100 border-gray-300 text-gray-600"
            readOnly
            aria-readonly="true"
          />
          <span className="ml-2 text-foreground/70">.nestcrm.com.au</span>
        </div>
        <div className="flex items-start gap-1.5 mt-1">
          <p className="text-xs text-foreground/70">
            Your subdomain is automatically generated from your email domain. This will need to be verified after signup or a random subdomain may be assigned.
          </p>
        </div>
      </div>
    </>
  );
};

export default CompanyInfoFields;
