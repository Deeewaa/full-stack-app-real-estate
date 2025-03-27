import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfile() {
  const { id } = useParams();
  const userId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState("about");

  // Fetch user data
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["/api/users", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json() as Promise<User>;
    },
    enabled: !!userId,
  });

  // Fetch user's properties if they are a landlord
  const {
    data: properties,
    isLoading: isLoadingProperties,
  } = useQuery({
    queryKey: ["/api/properties/owner", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/properties/search?ownerId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json() as Promise<Property[]>;
    },
    enabled: !!userId && user?.userType === "Landlord & Sell",
  });

  // Fetch user's saved properties
  const {
    data: savedProperties,
    isLoading: isLoadingSavedProperties,
  } = useQuery({
    queryKey: ["/api/saved-properties", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/saved-properties/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch saved properties");
      
      // Fetch property details for each saved property
      const savedPropertiesData = await res.json();
      const propertyPromises = savedPropertiesData.map(async (saved: any) => {
        const propRes = await fetch(`/api/properties/${saved.propertyId}`);
        if (!propRes.ok) return null;
        return propRes.json();
      });
      
      const propertiesData = await Promise.all(propertyPromises);
      return propertiesData.filter(Boolean);
    },
    enabled: !!userId,
  });

  if (isLoadingUser) {
    return (
      <div className="container max-w-5xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center space-y-4">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const userInitials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user.username.substring(0, 2).toUpperCase();

  return (
    <div className="container max-w-5xl py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user.profileImage || ""} alt={user.fullName || user.username} />
                <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-center mb-1">{user.fullName || user.username}</h2>
              <Badge variant="outline" className="mb-4">
                {user.userType}
              </Badge>
              {user.phoneNumber && (
                <p className="text-sm text-muted-foreground mb-2">
                  {user.phoneNumber}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>

          {/* Contact section for non-owner view */}
          {parseInt(localStorage.getItem("userId") || "0") !== userId && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Contact {user.fullName?.split(" ")[0] || user.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              {user.userType === "Landlord & Sell" && (
                <TabsTrigger value="properties">
                  Properties
                </TabsTrigger>
              )}
              <TabsTrigger value="saved">Saved Properties</TabsTrigger>
            </TabsList>

            {/* About tab */}
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {user.fullName || user.username}</CardTitle>
                  <CardDescription>User information and biography</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.bio ? (
                    <div>
                      <h3 className="font-medium mb-2">Bio</h3>
                      <p className="text-muted-foreground">{user.bio}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No bio available</p>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Account Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Member since:</div>
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">Account type:</div>
                      <div>{user.userType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Properties tab - only for landlords */}
            {user.userType === "Landlord & Sell" && (
              <TabsContent value="properties" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Properties</CardTitle>
                    <CardDescription>
                      Properties listed by {user.fullName || user.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProperties ? (
                      <div className="grid grid-cols-1 gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-[200px] w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : properties && properties.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {properties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No properties listed yet</p>
                    )}
                  </CardContent>
                  {parseInt(localStorage.getItem("userId") || "0") === userId && (
                    <CardFooter>
                      <Button className="w-full">+ Add New Property</Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            )}

            {/* Saved properties tab */}
            <TabsContent value="saved" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Properties</CardTitle>
                  <CardDescription>
                    Properties saved by {user.fullName || user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSavedProperties ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-[200px] w-full" />
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : savedProperties && savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {savedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No saved properties</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}