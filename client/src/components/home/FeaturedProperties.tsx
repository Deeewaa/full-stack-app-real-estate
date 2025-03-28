import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "@shared/schema";

export default function FeaturedProperties() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured/list"],
  });

  return (
    <section id="properties" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Discover our handpicked selection of the most exclusive properties from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Skeleton className="h-6 w-40 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="flex justify-between mb-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
            : properties?.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/properties">
            <Button
              className="px-8 py-3 bg-primary hover:bg-primary-light text-white"
            >
              Browse All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
