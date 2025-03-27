import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const waitlistSchema = z.object({
  fullName: z.string().min(2, {
    message: "Please enter your full name",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  propertyInterest: z.string().min(1, {
    message: "Please select your property interest",
  }),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function WaitlistForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      propertyInterest: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: WaitlistFormValues) => {
    try {
      await apiRequest("POST", "/api/waitlist", data);
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
      console.error("Waitlist submission error:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Thank you for joining our waitlist!</h3>
            <p className="mt-2 text-green-700">
              We'll notify you as soon as EstateElite launches. In the meantime, feel free to browse our featured properties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  className="px-4 py-3 h-12 focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your email address" 
                  type="email" 
                  className="px-4 py-3 h-12 focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Property Interest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="px-4 py-3 h-12 focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                    <SelectValue placeholder="Select your property interest" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-neutral-700">
                  I agree to the <a href="#" className="text-primary hover:text-primary-light">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:text-primary-light">Privacy Policy</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-[#E0A458] hover:bg-[#E8BB7D] text-white font-medium px-4 py-3 h-12 transition-all"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>
    </Form>
  );
}
