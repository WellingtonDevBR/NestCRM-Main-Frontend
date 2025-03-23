
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
            onChange={(e) => setSubdomain(e.target.value)}
            required
            className="bg-white"
          />
          <span className="ml-2 text-foreground/70">.nestcrm.com.au</span>
        </div>
        <p className="text-xs text-foreground/70">
          This will be your unique URL for accessing your account
        </p>
      </div>
    </>
  );
};

export default CompanyInfoFields;
