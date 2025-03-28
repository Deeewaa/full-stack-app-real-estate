import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

interface FileUploaderProps {
  onImageUpload: (url: string) => void;
  endpoint: string; // API endpoint for upload
  fieldName: string; // Form field name
  multiple?: boolean;
  maxSizeMB?: number;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  acceptedFileTypes?: string;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onImageUpload,
  endpoint,
  fieldName,
  multiple = false,
  maxSizeMB = 8,
  buttonText = 'Upload Image',
  buttonVariant = 'outline',
  acceptedFileTypes = 'image/*',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: 'File too large',
        description: `Max file size is ${maxSizeMB}MB. Your file is ${fileSizeMB.toFixed(2)}MB.`,
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.imageUrl);
      
      toast({
        title: 'Upload successful',
        description: 'Your image has been uploaded.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
        multiple={multiple}
      />
      
      <Button 
        type="button" 
        variant={buttonVariant} 
        onClick={triggerFileInput}
        disabled={isUploading}
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
            {buttonText}
          </>
        )}
      </Button>
      
      {preview && (
        <div className="mt-4 rounded-md overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
        </div>
      )}
    </div>
  );
};

export default FileUploader;