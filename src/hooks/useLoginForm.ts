
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { toast } from "sonner";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type LoginFormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function useLoginForm() {
  const { signIn, redirectToTenantDomain, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // Validate field when it's touched or on submission
  const validateField = (field: 'email' | 'password', value: string) => {
    try {
      console.log(`🔍 Form Validation: Validating ${field} field`);
      const result = loginSchema.shape[field].parse(value);
      return { valid: true, error: undefined };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(`❌ Form Validation: ${field} validation error:`, error.errors[0]?.message);
        return { valid: false, error: error.errors[0]?.message };
      }
      console.log(`❌ Form Validation: ${field} unknown validation error`);
      return { valid: false, error: "Invalid input" };
    }
  };

  // Mark field as touched
  const handleBlur = (field: 'email' | 'password') => {
    console.log(`🔍 Form Interaction: ${field} field blurred`);
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { error } = validateField(field, field === 'email' ? email : password);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    console.log('🔍 Form Validation: Validating entire form');
    const emailResult = validateField('email', email);
    const passwordResult = validateField('password', password);
    
    const newErrors: LoginFormErrors = {};
    
    if (!emailResult.valid) newErrors.email = emailResult.error;
    if (!passwordResult.valid) newErrors.password = passwordResult.error;
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 Form Validation: Form validation result:', isValid ? 'Valid' : 'Invalid', newErrors);
    return isValid;
  };

  // Handle successful login and redirection
  const handleSuccessfulAuth = (response: any): void => {
    if (response && response.success && response.session && response.session.tenant) {
      const tenant = response.session.tenant;
      
      console.log('Redirect info:', { tenant });
      
      if (tenant) {
        // Use the auth service to handle the redirect
        // Cookies will be sent automatically
        redirectToTenantDomain(tenant);
      } else {
        console.error('Invalid tenant in response', response.session);
        throw new Error('Invalid authentication response');
      }
    } else {
      throw new Error(response?.error?.message || 'Authentication failed');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔍 Form Submission: Login form submitted');
    
    // Reset form error
    setErrors((prev) => ({ ...prev, form: undefined }));
    
    // Validate all fields before submission
    if (!validateForm()) {
      console.log('❌ Form Submission: Form validation failed, aborting submission');
      return;
    }
    
    console.log('🔍 Form Submission: Form is valid, proceeding with login');
    setIsLoading(true);
    
    try {
      console.log('🔍 Form Submission: Calling signIn with email:', email);
      const response = await signIn(email, password);
      console.log('🔍 Form Submission: signIn response:', response);
      
      if (response.success && response.session) {
        toast.success('Login successful!');
        
        try {
          // Redirect to tenant subdomain (cookies will be sent automatically)
          handleSuccessfulAuth(response);
        } catch (redirectError: any) {
          console.error('❌ Redirect Error:', redirectError);
          setErrors((prev) => ({ ...prev, form: 'Error during redirect. Please try again.' }));
          setIsLoading(false);
        }
      } else {
        // Display the error message from the response
        const errorMessage = response.error?.message || "Failed to sign in. Please try again.";
        setErrors((prev) => ({ ...prev, form: errorMessage }));
        toast.error("Login failed", {
          description: errorMessage,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('❌ Form Submission: Login error:', error);
      const errorMessage = "An unexpected error occurred. Please try again later.";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      toast.error("Login failed", {
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  return {
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
  };
}
