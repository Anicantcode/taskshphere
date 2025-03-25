
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  taskId: string;
  groupId: string;
  onSuccess?: (submissionId: string, fileUrl: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ taskId, groupId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadComplete(false);
      setUploadProgress(0);
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setUploadComplete(false);
    setUploadProgress(0);
  };
  
  const handleSubmit = async () => {
    if (!file || !taskId || !groupId) return;
    
    setUploading(true);
    
    try {
      // 1. Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${taskId}_${Date.now()}.${fileExt}`;
      const filePath = `${groupId}/${fileName}`;
      
      // Create an XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Track upload progress manually
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Upload the file using standard Supabase storage upload
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Once upload is complete, set progress to 100%
      setUploadProgress(100);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      // 2. Create submission record in the database
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert([
          {
            task_id: taskId,
            group_id: groupId,
            content: fileUrl,
            content_type: 'file',
            status: 'pending',
          },
        ])
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      setUploadComplete(true);
      
      toast({
        title: 'Submission successful',
        description: 'Your work has been submitted for review.',
        variant: 'default',
      });
      
      if (onSuccess && submission) {
        onSuccess(submission.id, fileUrl);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        {!file ? (
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 mb-2 text-gray-500" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate flex-1">{file.name}</span>
              <button 
                onClick={handleClearFile}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {(uploading || uploadComplete) && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${uploadComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            
            {!uploading && !uploadComplete && (
              <button
                onClick={handleSubmit}
                className="mt-4 btn-primary w-full flex items-center justify-center"
              >
                Submit
              </button>
            )}
            
            {uploading && (
              <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </div>
            )}
            
            {uploadComplete && (
              <div className="mt-2 flex items-center justify-center text-sm text-green-500">
                <Check className="h-4 w-4 mr-2" />
                Upload complete
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
