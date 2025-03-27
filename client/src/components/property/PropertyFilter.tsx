import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { Search, RefreshCw } from "lucide-react";

interface PropertyFilterProps {
  onFilterChange: (filters: {
    location: string;
    propertyType: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
}

export default function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
  const [location, setLocation] = useState("Any Location");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  const handleSearch = () => {
    onFilterChange({
      location,
      propertyType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleReset = () => {
    setLocation("Any Location");
    setPropertyType("Any Type");
    setPriceRange([0, 10000000]);
    
    onFilterChange({
      location: "Any Location",
      propertyType: "Any Type",
      minPrice: 0,
      maxPrice: 0,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Filter Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
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

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full">
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

          <div className="space-y-4 sm:col-span-2">
            <div className="flex justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-neutral-600">
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              defaultValue={[0, 10000000]}
              value={priceRange}
              min={0}
              max={10000000}
              step={500000}
              onValueChange={setPriceRange}
              className="mt-6"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary-light sm:flex-1">
            <Search className="mr-2 h-4 w-4" /> Search Properties
          </Button>
          <Button variant="outline" onClick={handleReset} className="sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
