import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Image, AlertCircle, Pencil } from "lucide-react";

interface ProfileEditProps {
  user: User;
  onCancel: () => void;
}

// Create profile update schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEdit({ user, onCancel }: ProfileEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      bio: user.bio || "",
      phoneNumber: user.phoneNumber || "",
      profileImage: user.profileImage || "",
    },
  });
  
  // Handle image selection from file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageError(null);
    
    // Check file type
    if (!file.type.match('image.*')) {
      setImageError('Please select an image file');
      return;
    }
    
    // Check file size (max 8MB to stay under our 10MB server limit)
    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be less than 8MB');
      return;
    }
    
    // Create a temporary URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      
      // Update the form value with the image data URL
      form.setValue('profileImage', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      // Call API to update user profile
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      // Update the cache with the new user data
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.id] });

      toast({
        title: "Profile updated!",
        description: "Your profile information has been updated successfully.",
      });

      // Close the edit form
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      
      let errorMessage = "Failed to update profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check for specific payload size error
      if (errorMessage.toLowerCase().includes("too large") || 
          errorMessage.toLowerCase().includes("payload") ||
          errorMessage.toLowerCase().includes("entity")) {
        errorMessage = "The image is too large. Please choose a smaller image (less than 8MB).";
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description about yourself that will be visible on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your contact number (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div 
                            className="w-32 h-32 rounded-full overflow-hidden border-2 border-muted cursor-pointer"
                            onClick={triggerFileInput}
                          >
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted text-2xl font-bold">
                                {user.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || user.username?.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <Button 
                            type="button"
                            size="icon" 
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md" 
                            onClick={triggerFileInput}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Change image</span>
                          </Button>
                        </div>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full text-sm"
                            onClick={triggerFileInput}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                        <div>
                          <Input
                            type="url"
                            placeholder="Or enter image URL"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setImagePreview(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      {imageError && (
                        <div className="flex items-center text-destructive text-sm mt-2">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {imageError}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a profile picture (max 8MB) or provide an image URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}