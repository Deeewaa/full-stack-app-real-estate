import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

interface MultiFileUploaderProps {
  onImagesUpload: (urls: string[]) => void;
  endpoint: string; // API endpoint for upload
  fieldName: string; // Form field name
  maxFiles?: number;
  maxSizeMB?: number;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  acceptedFileTypes?: string;
  className?: string;
}

const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  onImagesUpload,
  endpoint,
  fieldName,
  maxFiles = 5,
  maxSizeMB = 8,
  buttonText = 'Upload Images',
  buttonVariant = 'outline',
  acceptedFileTypes = 'image/*',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit number of files
    if (files.length + uploadedUrls.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can upload a maximum of ${maxFiles} images.`,
        variant: 'destructive',
      });
      return;
    }

    // Convert FileList to Array
    const fileArray = Array.from(files);

    // Check file sizes
    const oversizedFiles = fileArray.filter(file => file.size / (1024 * 1024) > maxSizeMB);
    if (oversizedFiles.length > 0) {
      toast({
        title: 'Files too large',
        description: `Max file size is ${maxSizeMB}MB. Some files exceed this limit.`,
        variant: 'destructive',
      });
      return;
    }

    // Show previews
    const newPreviews: string[] = [];
    const previewPromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    });

    const previewResults = await Promise.all(previewPromises);
    setPreviews([...previews, ...previewResults]);

    // Upload files
    setIsUploading(true);
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        return data.imageUrl;
      });

      const urls = await Promise.all(uploadPromises);
      const newUrls = [...uploadedUrls, ...urls];
      setUploadedUrls(newUrls);
      onImagesUpload(newUrls);
      
      toast({
        title: 'Upload successful',
        description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading your images.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    // Create new arrays without the removed image
    const newPreviews = [...previews];
    const newUrls = [...uploadedUrls];
    
    newPreviews.splice(index, 1);
    newUrls.splice(index, 1);
    
    setPreviews(newPreviews);
    setUploadedUrls(newUrls);
    onImagesUpload(newUrls);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
        multiple={true}
      />
      
      <Button 
        type="button" 
        variant={buttonVariant} 
        onClick={triggerFileInput}
        disabled={isUploading || uploadedUrls.length >= maxFiles}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {buttonText} ({uploadedUrls.length}/{maxFiles})
          </>
        )}
      </Button>
      
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative rounded-md overflow-hidden group">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader;