import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchSection() {
  const [, navigate] = useLocation();
  const [location, setLocation] = useState("Any Location");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [priceRange, setPriceRange] = useState("Any Price");

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();
    if (location !== "Any Location") params.append("location", location);
    if (propertyType !== "Any Type") params.append("propertyType", propertyType);
    if (priceRange !== "Any Price") {
      const [min, max] = getPriceRangeValues(priceRange);
      if (min) params.append("minPrice", min.toString());
      if (max) params.append("maxPrice", max.toString());
    }

    // Navigate to properties page with filters
    navigate(`/properties?${params.toString()}`);
  };

  const getPriceRangeValues = (range: string): [number, number | null] => {
    switch (range) {
      case "$500,000 - $1,000,000":
        return [500000, 1000000];
      case "$1,000,000 - $2,000,000":
        return [1000000, 2000000];
      case "$2,000,000 - $5,000,000":
        return [2000000, 5000000];
      case "$5,000,000+":
        return [5000000, null];
      default:
        return [0, null];
    }
  };

  return (
    <section className="bg-white py-12 -mt-16 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-300 h-12">
                    <SelectValue placeholder="Any Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Location">Any Location</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Miami">Miami</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Seattle">Seattle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-300 h-12">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Type">Any Type</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Estate">Estate</SelectItem>
                    <SelectItem value="Mansion">Mansion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-300 h-12">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Price">Any Price</SelectItem>
                    <SelectItem value="$500,000 - $1,000,000">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="$1,000,000 - $2,000,000">$1,000,000 - $2,000,000</SelectItem>
                    <SelectItem value="$2,000,000 - $5,000,000">$2,000,000 - $5,000,000</SelectItem>
                    <SelectItem value="$5,000,000+">$5,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="self-end">
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 bg-primary hover:bg-primary-light"
                >
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
