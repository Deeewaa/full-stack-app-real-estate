import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Lock, Home, Building, LogIn, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoggingIn(true);
      await login(values.username, values.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Toast notification is handled in the AuthContext
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden">
        {/* Left side - Image and company info */}
        <div className="bg-primary md:w-2/5 p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="mb-6">
              <Home size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Realty Estate</h2>
            <p className="opacity-90 mb-8">Welcome back to Zambia's premier real estate platform.</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Explore Properties</h3>
              <p className="opacity-80 text-sm">Access exclusive listings, save your favorites, and connect with agents across Zambia.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Building size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium">David Wantula Emert Makungu</p>
                <p className="text-xs opacity-80">Principal Agent & Owner</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="bg-white md:w-3/5 p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Enter your username" className="pl-10 py-6" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs font-medium" 
                        type="button"
                        onClick={() => {
                          toast({
                            title: "Password Reset",
                            description: "Password reset functionality coming soon!",
                          });
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="pl-10 py-6 pr-10"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full py-6 mt-6 text-base font-medium transition-colors"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in <LogIn size={16} className="ml-2" />
                  </span>
                )}
              </Button>
              
              <div className="relative my-6">
                <Separator className="absolute inset-0 flex items-center" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button 
                  variant="outline" 
                  className="font-semibold flex items-center justify-center gap-2 w-full border-primary/20 hover:bg-primary/5 text-primary" 
                  onClick={() => navigate("/auth/register")}
                >
                  <UserPlus size={16} />
                  Create an account
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}