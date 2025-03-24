import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { signIn, redirectToTenantDomain } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success && result.session) {
        toast.success("Login successful");
        
        // Show loading toast during redirect
        toast.loading("Connecting to your dashboard...");
        
        // Use the enhanced redirectToTenantDomain that checks status
        redirectToTenantDomain(result.session.tenant);
      } else {
        setError(result.error?.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="text-purple-600 hover:underline">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
