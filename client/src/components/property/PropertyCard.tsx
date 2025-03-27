import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, SquareCode } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/properties/${property.id}`}>
        <a className="block">
          <div className="relative overflow-hidden h-64">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {property.isFeatured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary hover:bg-primary text-white">FEATURED</Badge>
              </div>
            )}
            {property.isNew && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#D8553A] hover:bg-[#D8553A] text-white">NEW</Badge>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                variant="ghost"
                className="bg-white text-neutral-700 hover:text-[#D8553A] rounded-full h-9 w-9 p-0"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-[#D8553A] text-[#D8553A]" : ""}`}
                />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">{property.title}</h3>
                <p className="text-neutral-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-[#D8553A]" />
                  {property.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#E0A458]">${property.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-between text-neutral-600 mb-6">
              <span className="flex items-center">
                <Bed className="h-4 w-4 mr-1" /> {property.bedrooms} Beds
              </span>
              <span className="flex items-center">
                <Bath className="h-4 w-4 mr-1" /> {property.bathrooms} Baths
              </span>
              <span className="flex items-center">
                <SquareCode className="h-4 w-4 mr-1" /> {property.squareFeet.toLocaleString()} Sqft
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full text-primary border-primary hover:bg-primary hover:text-white"
            >
              View Details
            </Button>
          </div>
        </a>
      </Link>
    </div>
  );
}
