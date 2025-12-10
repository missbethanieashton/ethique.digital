import React, { useState, useRef } from "react";
import { Upload, X, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileUploadInput({ 
  label, 
  accept, 
  currentUrl, 
  onFileSelect,
  type = "image" // "image" or "video"
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setFileName(file.name);
    
    // Create preview for images
    if (type === "image") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    
    // Pass file to parent
    onFileSelect(file);
  };

  const handleClear = () => {
    setPreview(currentUrl || null);
    setFileName("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect(null);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {preview && type === "image" ? (
          <div className="space-y-3">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 truncate">{fileName || "Current file"}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300"
              >
                <X size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {type === "video" ? <Video size={20} /> : <Image size={20} />}
              <span className="text-sm text-gray-300 truncate">{fileName}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-400 hover:text-red-300"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                className="mb-2"
              >
                Choose File
              </Button>
              <p className="text-sm text-gray-400">or drag and drop</p>
              <p className="text-xs text-gray-500">{accept}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}