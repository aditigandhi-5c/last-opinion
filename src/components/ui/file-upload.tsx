import { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Button } from "./button";

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesSelected?: (files: File[]) => void;
}

export const FileUpload = ({ 
  label, 
  description, 
  accept = "*", 
  multiple = false, 
  className,
  onFilesSelected 
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles);
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);

    // Simulate upload process
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-smooth",
          isDragOver 
            ? "border-primary bg-primary-light" 
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files here, or{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => document.getElementById(`file-input-${label}`)?.click()}
          >
            browse files
          </Button>
        </p>
        <input
          id={`file-input-${label}`}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-accent" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};