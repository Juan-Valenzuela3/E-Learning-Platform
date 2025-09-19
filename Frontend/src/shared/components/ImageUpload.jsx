import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  uploadCourseThumbnail,
  validateImageFile,
} from "@/services/uploadService";
import { toast } from "react-toastify";

const ImageUpload = ({
  value,
  onChange,
  placeholder = "Haz clic para subir una imagen",
  className = "",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (disabled || isUploading) return;

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadCourseThumbnail(file);
      onChange(imageUrl);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error(error.message || "Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

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

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    if (disabled || isUploading) return;
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Imagen de portada"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                disabled={disabled || isUploading}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 disabled:opacity-50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Imagen de portada seleccionada
          </p>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
            ${
              dragActive
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isUploading ? "opacity-50 cursor-wait" : ""}
          `}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 text-center mb-1">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  JPG, PNG hasta 5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
