import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapComponent } from "@/components/ui/map";
import { MortgageCalculator } from "@/components/ui/mortgage-calculator";
import { 
  BedDouble, 
  Bath, 
  SquareArrowOutUpRight, 
  MapPin, 
  Info, 
  CalculatorIcon, 
  MapIcon, 
  ChevronLeft 
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/properties" className="flex items-center gap-2">
                <ChevronLeft size={18} />
                Back to Properties
              </Link>
            </Button>
            <Skeleton className="h-12 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-8" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full mb-8 rounded-lg" />
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Skeleton className="h-[200px] w-full mb-6 rounded-lg" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 pb-16 bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Property Not Found</h2>
          <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/properties">View All Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock images for the gallery (in a real app, these would come from the API)
  const images = [
    property.imageUrl,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ];

  return (
    <div className="pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/properties" className="flex items-center gap-2">
              <ChevronLeft size={18} />
              Back to Properties
            </Link>
          </Button>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">{property.title}</h1>
          <div className="flex items-center text-accent gap-2">
            <MapPin size={18} />
            <span>{property.location}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${property.title} - Image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && property.isNew && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-accent hover:bg-accent text-white">NEW</Badge>
                          </div>
                        )}
                        {index === 0 && property.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary hover:bg-primary text-white">FEATURED</Badge>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <BedDouble className="h-6 w-6 text-primary mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-neutral-500">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <Bath className="h-6 w-6 text-primary mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-neutral-500">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <SquareArrowOutUpRight className="h-6 w-6 text-primary mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">{property.squareFeet.toLocaleString()}</div>
                      <div className="text-sm text-neutral-500">Square Feet</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-4">
                    <p className="text-neutral-700">{property.description}</p>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Property Type</span>
                        <span className="font-medium">{property.propertyType}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Year Built</span>
                        <span className="font-medium">2020</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Lot Size</span>
                        <span className="font-medium">0.5 acres</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Garage</span>
                        <span className="font-medium">2 cars</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Cooling</span>
                        <span className="font-medium">Central A/C</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Heating</span>
                        <span className="font-medium">Forced Air</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Water</span>
                        <span className="font-medium">City</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-neutral-500">Sewer</span>
                        <span className="font-medium">Public</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-secondary mb-6">
                  ZMW {property.price.toLocaleString()}
                </div>
                
                <div className="space-y-4 mb-6">
                  <Button className="w-full">Schedule a Viewing</Button>
                  <Button variant="outline" className="w-full">Contact Agent</Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-neutral-700">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Property Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Property ID:</span>
                      <span className="font-medium">PR-{property.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Property Type:</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{property.city}, {property.state}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Square Footage:</span>
                      <span className="font-medium">{property.squareFeet.toLocaleString()} sqft</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="mortgage" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mortgage" className="flex items-center gap-2">
                  <CalculatorIcon className="h-4 w-4" />
                  <span>Mortgage</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mortgage" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mortgage Calculator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MortgageCalculator propertyPrice={property.price} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full rounded-md overflow-hidden">
                      <MapComponent 
                        location={{
                          lat: property.latitude || 40.7128, 
                          lng: property.longitude || -74.0060
                        }} 
                        zoom={13}
                      />
                    </div>
                    <p className="mt-3 text-sm text-neutral-500 text-center">
                      {property.location}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
