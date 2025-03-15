
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
  const { signIn, isAuthenticated } = useAuth();
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
      const result = loginSchema.shape[field].parse(value);
      return { valid: true, error: undefined };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, error: error.errors[0]?.message };
      }
      return { valid: false, error: "Invalid input" };
    }
  };

  // Mark field as touched
  const handleBlur = (field: 'email' | 'password') => {
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
    const emailResult = validateField('email', email);
    const passwordResult = validateField('password', password);
    
    const newErrors: LoginFormErrors = {};
    
    if (!emailResult.valid) newErrors.email = emailResult.error;
    if (!passwordResult.valid) newErrors.password = passwordResult.error;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset form error
    setErrors((prev) => ({ ...prev, form: undefined }));
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // The redirection is now handled directly in the signIn method
      // within authService.ts to ensure a more reliable flow
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to sign in. Please try again.";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      toast.error("Login failed", {
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  // This function is kept for compatibility with components that use it
  // But redirection is now primarily handled in authService.ts
  const determineRedirectPath = () => {
    return '/organizations';
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
    determineRedirectPath,
    errors,
    handleBlur,
    touched
  };
}
