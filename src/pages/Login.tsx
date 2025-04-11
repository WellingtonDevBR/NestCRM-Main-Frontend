
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import LoginHero from "@/components/auth/LoginHero";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    errors,
    handleBlur,
    touched
  } = useLoginForm();
  
  const navigate = useNavigate();
  
  // Log authentication state on component mount
  useEffect(() => {
    console.log('🔑 Authentication: Login page mounted, authentication state:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
  }, []);
  
  // Redirect authenticated users to home
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚀 Redirection: User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 -ml-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <LoginHeader />

          <div className="mt-8">
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
          </div>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <LoginHero />
    </div>
  );
};

export default Login;
