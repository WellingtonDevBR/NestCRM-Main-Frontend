
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            // Make subdomain read-only since it's auto-populated from email
            readOnly
            className="bg-gray-50"
          />
          <span className="ml-2 text-foreground/70">.nestcrm.com.au</span>
        </div>
        <p className="text-xs text-foreground/70">
          Your subdomain is automatically generated from your email domain and cannot be changed
        </p>
      </div>
    </>
  );
};

export default CompanyInfoFields;
