import { useState } from "react";
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
import FileUploader from "@/components/upload/FileUploader";

interface ProfileEditProps {
  user: User;
  onCancel: () => void;
}

// Create profile update schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEdit({ user, onCancel }: ProfileEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
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

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    form.setValue('profileImage', imageUrl);
    setImagePreview(imageUrl);
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
                      {/* Profile Picture Preview */}
                      <div className="flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-muted">
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
                      </div>
                      
                      {/* File Uploader */}
                      <FileUploader 
                        onImageUpload={handleImageUpload}
                        endpoint="/api/upload/profile"
                        fieldName="profileImage"
                        buttonText="Upload Profile Picture"
                        maxSizeMB={8}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a profile picture (max 8MB)
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