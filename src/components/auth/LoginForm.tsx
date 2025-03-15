
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { LoginFormErrors } from "@/hooks/useLoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errors: LoginFormErrors;
  handleBlur: (field: 'email' | 'password') => void;
  touched: Record<string, boolean>;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  isLoading,
  handleSubmit,
  errors,
  handleBlur,
  touched
}: LoginFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form error message */}
      {errors.form && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center justify-between">
          Email address
          {touched.email && errors.email && (
            <span className="text-xs text-destructive">{errors.email}</span>
          )}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          autoComplete="email"
          required
          className={`bg-white ${touched.email && errors.email ? 'border-destructive' : ''}`}
          aria-invalid={touched.email && !!errors.email}
          disabled={isLoading}
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="flex items-center">
            Password
            {touched.password && errors.password && (
              <span className="ml-2 text-xs text-destructive">{errors.password}</span>
            )}
          </Label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:text-primary/80"
            tabIndex={isLoading ? -1 : 0}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            autoComplete="current-password"
            required
            className={`bg-white pr-10 ${touched.password && errors.password ? 'border-destructive' : ''}`}
            aria-invalid={touched.password && !!errors.password}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={togglePasswordVisibility}
            tabIndex={isLoading ? -1 : 0}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-foreground/50" />
            ) : (
              <Eye className="h-4 w-4 text-foreground/50" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full button-gradient"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
