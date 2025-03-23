
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthResult } from "@/domain/auth/types";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import PersonalInfoFields from "@/components/auth/form/PersonalInfoFields";
import CompanyInfoFields from "@/components/auth/form/CompanyInfoFields";
import PasswordField from "@/components/auth/form/PasswordField";
import TermsCheckbox from "@/components/auth/form/TermsCheckbox";
import SubmitButton from "@/components/auth/form/SubmitButton";
import FormDivider from "@/components/auth/form/FormDivider";

const SignUpForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result: AuthResult = await signUp({
        firstName,
        lastName,
        companyName,
        email,
        subdomain,
        password
      });
      
      if (result.success && result.session) {
        toast.success("Account created successfully!");
        
        // Redirect to tenant subdomain
        redirectToTenantDomain(result.session.tenant, result.session.token.token);
      } else {
        toast.error("Failed to create account", {
          description: result.error?.message || "Please try again later."
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to create account", {
        description: error.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInfoFields
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
        />

        <CompanyInfoFields
          companyName={companyName}
          setCompanyName={setCompanyName}
          subdomain={subdomain}
          setSubdomain={setSubdomain}
        />

        <PasswordField
          password={password}
          setPassword={setPassword}
        />

        <TermsCheckbox />

        <SubmitButton isLoading={isLoading} />
      </form>

      <FormDivider />

      <SocialLoginButtons />
    </div>
  );
};

export default SignUpForm;
