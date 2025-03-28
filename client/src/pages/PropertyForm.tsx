import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Image } from "lucide-react";
import MultiFileUploader from "@/components/upload/MultiFileUploader";

// Form schema
const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  price: z.coerce.number().positive("Price must be positive"),
  imageUrl: z.string().url("Please provide a valid main image URL"),
  additionalImages: z.array(z.string().url()).optional(),
  squareFeet: z.coerce.number().positive("Area must be positive"),
  bedrooms: z.coerce.number().int().min(0, "Number of bedrooms must be positive"),
  bathrooms: z.coerce.number().min(0, "Number of bathrooms must be positive"),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.string().min(1, "Listing type is required"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const defaultValues: PropertyFormValues = {
  title: "",
  description: "",
  location: "",
  city: "",
  state: "",
  price: 0,
  imageUrl: "",
  additionalImages: [],
  squareFeet: 0,
  bedrooms: 0,
  bathrooms: 0,
  propertyType: "",
  listingType: "",
  isFeatured: false,
  isNew: true,
};

export default function PropertyForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get user ID from local storage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("You need to be logged in to post a property");
      }
      
      // Add the owner ID to the data
      const propertyData = {
        ...data,
        ownerId: parseInt(userId),
      };
      
      // Submit to API
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }
      
      const result = await response.json();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/owner"] });
      
      toast({
        title: "Property Created",
        description: "Your property has been listed successfully!",
      });
      
      // Redirect to the property page
      navigate(`/properties/${result.id}`);
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">List a New Property</CardTitle>
          <CardDescription>
            Fill out the form below to list your property on our platform
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Beautiful 3 Bedroom House in Lusaka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (ZMW)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 500000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Street Address)</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., 123 Kabulonga Road" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Lusaka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Lusaka Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property in detail..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Property Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sqft)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="For sale or rent?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="For Rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Property</FormLabel>
                          <FormDescription>
                            Mark this property as featured on the homepage
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Listing</FormLabel>
                          <FormDescription>
                            Mark this property as a new listing
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Property Images</h3>
                
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Property Image</FormLabel>
                        <FormControl>
                          <FileUploader
                            onImageUpload={(url) => field.onChange(url)}
                            endpoint="/api/upload/property"
                            fieldName="propertyImage"
                            maxSizeMB={8}
                            buttonText="Upload Main Image"
                          />
                        </FormControl>
                        <FormDescription>
                          This will be the primary image shown for your property
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Images</FormLabel>
                        <FormControl>
                          <MultiFileUploader
                            onImagesUpload={(urls) => field.onChange(urls)}
                            endpoint="/api/upload/property"
                            fieldName="propertyImage"
                            maxFiles={4}
                            maxSizeMB={8}
                            buttonText="Upload Additional Images"
                          />
                        </FormControl>
                        <FormDescription>
                          Upload up to 4 additional images of your property (max 8MB each)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Property"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}