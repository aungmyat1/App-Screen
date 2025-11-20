"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";

interface FileWithPreview extends File {
  preview: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const uploadAbortControllers = useRef<{ [key: string]: AbortController }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ) as FileWithPreview[];
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    URL.revokeObjectURL(files.find(f => f.name === fileName)?.preview || "");
  };

  const cancelUpload = (fileName: string) => {
    if (uploadAbortControllers.current[fileName]) {
      uploadAbortControllers.current[fileName].abort();
      delete uploadAbortControllers.current[fileName];
    }
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const uploadFile = async (file: File) => {
    const controller = new AbortController();
    uploadAbortControllers.current[file.name] = controller;
    
    try {
      // Get signed URL from backend
      const response = await fetch(`/api/upload/sign?url=${encodeURIComponent(file.name)}`);
      const { url, fields } = await response.json();

      // Create form data
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      // Upload file with progress tracking
      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percentComplete
            }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        xhr.open("POST", url);
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      delete uploadAbortControllers.current[file.name];
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    
    try {
      // Upload files sequentially
      for (const file of files) {
        try {
          await uploadFile(file);
          setUploadedFiles(prev => [...prev, file]);
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error(`Failed to upload ${file.name}:`, error);
          }
        }
      }
      
      // Clear uploaded files
      files.forEach(file => URL.revokeObjectURL(file.preview));
      setFiles([]);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Screenshots</CardTitle>
        <CardDescription>Drag and drop your screenshots or click to browse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <Icons.upload className="h-10 w-10 text-gray-400" />
            <div className="space-y-1">
              <p className="text-lg font-medium">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-gray-500">
                or <span className="text-primary font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG, GIF, WEBP (Max 10MB each)
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Selected Files</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload All"
                )}
              </Button>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={file.preview} 
                        alt={file.name} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center">
                        {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                          <Icons.spinner className="h-4 w-4 text-white animate-spin" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadProgress[file.name] > 0 ? (
                      <>
                        <Progress value={uploadProgress[file.name]} className="w-24" />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => cancelUpload(file.name)}
                        >
                          <Icons.x className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile(file.name)}
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <Icons.checkCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">Successfully uploaded</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}