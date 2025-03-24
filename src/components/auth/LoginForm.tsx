
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Define the props interface for the LoginForm component
interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errors: {
    email?: string;
    password?: string;
    form?: string;
  };
  handleBlur: (field: 'email' | 'password') => void;
  touched: Record<string, boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({
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
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              className={touched.email && errors.email ? "border-red-500" : ""}
              required
            />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={touched.password && errors.password ? "border-red-500" : ""}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {touched.password && errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="text-purple-600 hover:underline ml-1">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
