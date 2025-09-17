import React, { useRef, useState, DragEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { FileAttachment } from '../../types';
import { isValidFileType, isValidFileSize, formatFileSize, generateId, formatDate } from '../../utils/helpers';

interface FileUploadProps {
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);

  const handleFiles = async (fileList: FileList) => {
    const newFiles: FileAttachment[] = [];
    const uploadingIds: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file count limit
      if (files.length + newFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        break;
      }

      // Validate file type
      if (!isValidFileType(file.type)) {
        toast.error(`${file.name}: File type not supported. Please use PDF, DOC, DOCX, PNG, or JPG files.`);
        continue;
      }

      // Validate file size
      if (!isValidFileSize(file.size)) {
        toast.error(`${file.name}: File size too large. Maximum ${formatFileSize(maxSize)} allowed.`);
        continue;
      }

      const fileId = generateId();
      uploadingIds.push(fileId);

      try {
        const base64Content = await fileToBase64(file);
        
        const fileAttachment: FileAttachment = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          content: base64Content,
          uploadedAt: new Date(),
        };

        newFiles.push(fileAttachment);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
        console.error('File processing error:', error);
      }
    }

    setUploading(uploadingIds);
    
    // Simulate upload delay
    setTimeout(() => {
      onFilesChange([...files, ...newFiles]);
      setUploading([]);
      
      if (newFiles.length > 0) {
        toast.success(`${newFiles.length} file(s) uploaded successfully`);
        console.log('📧 File upload notification: Files uploaded for project submission');
      }
    }, 1500);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
    toast.success('File removed');
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`file-drop-zone ${dragActive ? 'drag-over' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          PDF, DOC, DOCX, PNG, JPG files up to {formatFileSize(maxSize)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Maximum {maxFiles} files allowed
        </p>
      </div>

      {/* File List */}
      {(files.length > 0 || uploading.length > 0) && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Uploaded Files</h4>
          
          {files.map((file) => {
            const IconComponent = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • Uploaded {formatDate(file.uploadedAt).split(',')[0]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Uploading files */}
          {uploading.map((id) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center space-x-3">
                <div className="spinner w-5 h-5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Uploading...</p>
                  <p className="text-xs text-blue-500">Processing file</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Stats */}
      {files.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {files.length} of {maxFiles} files uploaded
        </div>
      )}
    </div>
  );
};

export default FileUpload;