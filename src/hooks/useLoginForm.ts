
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as z from 'zod';
import { toast } from 'sonner';

// Form validation schema
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export const useLoginForm = () => {
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form state when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrors({});
    setTouched({});
    setIsLoading(false);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle input field blur for validation
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // Validate a specific field
  const validateField = (field: string) => {
    console.log(`🔍 Form Validation: Validating ${field} field`);
    
    try {
      const fieldSchema = schema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: field === 'email' ? email : password });
      
      // Clear error for this field if validation passes
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.errors[0]?.message;
        setErrors(prev => ({ ...prev, [field]: fieldError }));
        return false;
      }
      return true;
    }
  };

  // Validate the entire form
  const validateForm = () => {
    console.log('🔍 Form Validation: Validating entire form');
    try {
      schema.parse({ email, password });
      console.log('🔍 Form Validation: Form validation result: Valid', {});
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors: FormErrors = {};
        err.errors.forEach(error => {
          const field = error.path[0];
          formErrors[field as keyof FormErrors] = error.message;
        });
        console.log('🔍 Form Validation: Form validation result: Invalid', formErrors);
        setErrors(formErrors);
        return false;
      }
      return true;
    }
  };

  // Determine the redirect path after successful login
  const determineRedirectPath = () => {
    console.log('🚀 Redirection: determineRedirectPath called (legacy method)');
    // Default redirect to organizations page
    const redirectPath = '/organizations';
    console.log('🚀 Redirection: User is authenticated, redirecting to:', redirectPath);
    return redirectPath;
  };

  // Form submission handler - updating to return Promise<void>
  const handleSubmit = async (e: React.FormEvent, targetTenant?: string | null): Promise<void> => {
    e.preventDefault();
    console.log('🔍 Form Submission: Login form submitted');
    
    const isValid = validateForm();

    if (isValid) {
      console.log('🔍 Form Submission: Form is valid, proceeding with login');
      console.log('🔍 Form Submission: Calling signIn with email:', email);
      setIsLoading(true);

      try {
        await signIn(email, password, targetTenant);
        console.log('🔍 Form Submission: signIn completed successfully');
      } catch (error) {
        // Error handling is done in the signIn function already
        console.log('🔍 Form Submission: signIn failed with error');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('🔍 Form Submission: Form has validation errors, not proceeding');
      // Mark all fields as touched to show all errors
      setTouched({ email: true, password: true });
      
      // Notify user about errors
      toast.error('Please correct the errors in the form', {
        description: 'Please check the highlighted fields',
      });
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
    determineRedirectPath,
    errors,
    handleBlur,
    touched,
  };
};
