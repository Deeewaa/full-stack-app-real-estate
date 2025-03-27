import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyFilter from "@/components/property/PropertyFilter";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "@shared/schema";

export default function PropertyListing() {
  const [filters, setFilters] = useState({
    location: "Any Location",
    propertyType: "Any Type",
    minPrice: 0,
    maxPrice: 0,
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Explore Our Properties
          </h1>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Discover our curated selection of luxury properties from around the world.
          </p>
        </div>

        <PropertyFilter onFilterChange={handleFilterChange} />

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-6" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties && properties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {properties && properties.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-primary mb-2">No properties found</h3>
                  <p className="text-neutral-700 mb-6">Try adjusting your filters to see more results.</p>
                  <Button onClick={() => setFilters({
                    location: "Any Location",
                    propertyType: "Any Type",
                    minPrice: 0,
                    maxPrice: 0,
                  })}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
