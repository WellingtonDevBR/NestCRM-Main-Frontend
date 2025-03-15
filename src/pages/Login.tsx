
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation is handled in the signIn method
    } catch (error) {
      // Error is handled in the signIn method
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            >
              NESTCRM
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              New to NESTCRM?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:text-primary/80">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
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
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-secondary/30 px-2 text-foreground/70">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="bg-white">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="bg-white">
                  <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <div className="hidden lg:block relative flex-1 bg-cover bg-center" style={{ 
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url("https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070")` 
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-20">
          <div className="max-w-md text-white">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full">Welcome back</span>
            <h2 className="text-3xl font-bold mt-6 mb-4">Access your customer insights</h2>
            <p className="text-white/80 mb-8">
              Sign in to see your customer data, AI-powered insights, and take action to improve retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
