import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Pencil, Save, X, Mail } from "lucide-react";
import React, { useState } from "react";
import { uploadProfileImage } from "@/services/uploadService";
import { useProfileForm } from "@/shared/hooks/useProfileFrom";
import profileService from "@/services/profileService";

const AdminProfileEditor = () => {
  const {
    formData,
    setFormData,
    loading,
    error,
    isEditing,
    errors,
    handleChange,
    handleSave,
    handleCancel,
    setIsEditing,
  } = useProfileForm(profileService);

  const [uploadingImage, setUploadingImage] = useState(false);

  // No se requiere lógica extra para preview ni archivo, ya que la URL se actualiza al subir

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-red-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        </div>
      </div>
    );
  }
  if (error && !isEditing) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
          <p className="text-gray-600 text-sm">
            Gestiona la información de tu perfil de administrador
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-red-500 hover:bg-red-600 text-white">
            <Pencil className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" /> Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-base font-semibold text-gray-800">
            Información Personal
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Actualiza tu información personal y de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-100">
                <AvatarImage
                  src={formData.profileImageUrl}
                  alt={`${formData.userName} ${formData.lastName}&background=E5E7EB&color=6B7280`}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {formData.userName?.[0]}
                  {formData.lastName?.[0] || "U"}
                </AvatarFallback>
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-red-500" />
                  </div>
                )}
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label
                    className="p-2 bg-white bg-opacity-80 rounded-full cursor-pointer"
                    title="Cambiar foto">
                    <Pencil className="h-4 w-4 text-gray-800" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUploadingImage(true);
                          try {
                            const url = await uploadProfileImage(file);
                            setFormData((prev) => ({ ...prev, profileImageUrl: url }));
                          } catch (err) {
                            // Puedes mostrar un toast aquí si quieres
                          } finally {
                            setUploadingImage(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                {formData.userName} {formData.lastName}
              </h3>
              <p className="text-gray-600 text-sm">
                {formData.specialty || "Sin especialidad"}
              </p>
              <div className="flex justify-center sm:justify-start gap-3 mt-3">
                <a
                  href={`mailto:${formData.email}`}
                  className="text-gray-500 hover:text-red-500"
                  title="Enviar correo">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Nombre */}
            <div className="mb-4">
              <Label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </Label>
              {isEditing ? (
                <>
                  <Input
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.userName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                  {errors.userName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.userName}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  {formData.userName || "No especificado"}
                </p>
              )}
            </div>

            {/* Apellidos */}
            <div className="mb-4">
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </Label>
              {isEditing ? (
                <>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  {formData.lastName || "No especificado"}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </Label>
              {isEditing ? (
                <>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  {formData.email || "No especificado"}
                </p>
              )}
            </div>

            {/* Especialidad */}
            <div className="mb-4">
              <Label
                htmlFor="specialty"
                className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </Label>
              {isEditing ? (
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollo Web"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  {formData.specialty || "No especificado"}
                </p>
              )}
            </div>

            {/* Biografía */}
            <div className="sm:col-span-2 mb-4">
              <Label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </Label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                  placeholder="Cuéntanos sobre ti..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-line py-2 px-3 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
                  {formData.bio || "No hay biografía disponible"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileEditor;