import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyPhotoUploaderProps {
  additionalImages: string[];
  onAddImage: (imageUrl: string) => void;
  onRemoveImage: (index: number) => void;
}

export function PropertyPhotoUploader({
  additionalImages,
  onAddImage,
  onRemoveImage,
}: PropertyPhotoUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleAddImage = () => {
    // Validate URL
    if (!newImageUrl) {
      setError("Please enter an image URL");
      return;
    }

    // Simple URL validation
    try {
      new URL(newImageUrl);
    } catch (e) {
      setError("Please enter a valid URL");
      return;
    }

    // Add the image and reset form
    onAddImage(newImageUrl);
    setNewImageUrl("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => {
              setNewImageUrl(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter additional image URL"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddImage}
          >
            Add Image
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {additionalImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Additional Images ({additionalImages.length})</p>
          <ScrollArea className="h-48 rounded-md border">
            <div className="p-4 flex flex-wrap gap-4">
              {additionalImages.map((url, index) => (
                <div key={index} className="relative group">
                  <Card className="overflow-hidden w-36 h-36">
                    <CardContent className="p-0">
                      <img
                        src={url}
                        alt={`Additional property image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Show placeholder for invalid images
                          (e.target as HTMLImageElement).src = "https://placehold.co/144x144?text=Invalid+Image";
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Add multiple images to showcase your property. Enter the URL of each image and click "Add Image".
      </p>
    </div>
  );
}