import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import PropertyEditor from "@/components/property/PropertyEditor";
import { useToast } from "@/hooks/use-toast";

export default function PropertyForm() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const propertyId = id ? parseInt(id) : undefined;
  const isEditing = !!propertyId;
  
  // Get current user type from localStorage
  const userType = localStorage.getItem("userType");
  
  // Check if user is authorized to access this page
  useEffect(() => {
    if (userType !== "Landlord & Sell") {
      toast({
        title: "Access Denied",
        description: "Only Landlord & Sell users can create or edit properties.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [userType, navigate, toast]);

  // Handle successful property creation/update
  const handleSuccess = () => {
    navigate(isEditing ? `/properties/${propertyId}` : "/properties");
  };

  if (userType !== "Landlord & Sell") {
    return null; // Don't render anything if not authorized
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditing ? "Edit Property" : "Add New Property"}
      </h1>
      <PropertyEditor 
        propertyId={propertyId} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}