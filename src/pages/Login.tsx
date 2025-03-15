
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import LoginHero from "@/components/auth/LoginHero";
import { getSubdomainFromUrl, isMainDomain } from "@/utils/domainUtils";
import { toast } from "sonner";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isLoading,
    handleSubmit,
    isAuthenticated,
    determineRedirectPath,
    errors,
    handleBlur,
    touched
  } = useLoginForm();
  
  const navigate = useNavigate();
  
  // Check if we're on a subdomain - redirect to main domain
  useEffect(() => {
    const subdomain = getSubdomainFromUrl();
    if (subdomain && !isMainDomain(subdomain)) {
      console.log('🔒 Security: Login page accessed on subdomain, redirecting to main domain');
      toast.info("Redirecting to main site login...");
      window.location.href = `${window.location.protocol}//${import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173'}/login`;
      return;
    }
  }, []);
  
  // Log authentication state on component mount
  useEffect(() => {
    console.log('🔑 Authentication: Login page mounted, authentication state:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
  }, []);
  
  // Redirect authenticated users based on context
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = determineRedirectPath();
      console.log('🚀 Redirection: User is authenticated, redirecting to:', redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, determineRedirectPath]);

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginHeader />

          <div className="mt-8">
            <div className="space-y-6">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                errors={errors}
                handleBlur={handleBlur}
                touched={touched}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <SocialLoginButtons disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <LoginHero />
    </div>
  );
};

export default Login;
