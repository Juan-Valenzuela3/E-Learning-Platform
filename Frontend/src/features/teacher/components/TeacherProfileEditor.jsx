import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Pencil, Save, X, Mail } from 'lucide-react';
import { toast } from 'sonner';
import profileService from '@/services/profileService';

const TeacherProfileEditor = () => {
  const [formData, setFormData] = useState({
    userName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
    bio: '',
    specialty: '',
    website: '',
    socialMedia: { twitter: '', linkedin: '', github: '' },
    avatar: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userData = await profileService.getCurrentUser(true);
        const initialData = {
          userName: userData.userName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          profileImageUrl: userData.profileImageUrl || '',
          bio: userData.bio || '',
          specialty: userData.specialty || '',
          website: userData.website || '',
          socialMedia: {
            twitter: userData.twitter || '',
            linkedin: userData.linkedin || '',
            github: userData.github || ''
          },
          avatar: userData.profileImageUrl || ''
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || "Error al obtener el perfil del usuario");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Validación
  const validate = () => {
    const newErrors = {};
    if (!formData.userName?.trim()) newErrors.userName = 'El nombre es obligatorio';
    else if (formData.userName.trim().length < 2) newErrors.userName = 'Mínimo 2 caracteres';
    if (!formData.lastName?.trim()) newErrors.lastName = 'El apellido es obligatorio';
    else if (formData.lastName.trim().length < 2) newErrors.lastName = 'Mínimo 2 caracteres';
    if (!formData.email?.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Formato inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('socialMedia.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [key]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Guardar perfil
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setUpdating(true);
    setError(null);
    try {
      const updatedUser = await profileService.updateProfile(formData);
      setFormData(updatedUser);
      setOriginalData(updatedUser);
      toast.success("Perfil actualizado correctamente ✅");
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
    setErrors({});
  };

  if (loading) return <div className="flex items-center justify-center h-64 animate-spin rounded-full border-t-2 border-b-2 border-red-500"></div>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
          <p className="text-gray-600 text-sm">Gestiona la información de tu perfil de docente</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-red-500 hover:bg-red-600 text-white">
            <Pencil className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" /> Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-base font-semibold text-gray-800">Información Personal</CardTitle>
          <CardDescription className="text-sm text-gray-500">Actualiza tu información personal y de contacto.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-100">
                <AvatarImage src={formData.avatar} alt={`${formData.userName} ${formData.lastName}`} />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {formData.userName?.[0]}{formData.lastName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="p-2 bg-white bg-opacity-80 rounded-full cursor-pointer" title="Cambiar foto">
                    <Pencil className="h-4 w-4 text-gray-800" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">{formData.userName} {formData.lastName}</h3>
              <p className="text-gray-600 text-sm">{formData.specialty || 'Sin especialidad'}</p>
              <div className="flex justify-center sm:justify-start gap-3 mt-3">
                <a href={`mailto:${formData.email}`} className="text-gray-500 hover:text-red-500" title="Enviar correo">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Nombre */}
            <div className="mb-4">
              <Label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</Label>
              {isEditing ? (
                <>
                  <Input
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.userName && <p className="mt-1 text-xs text-red-600">{errors.userName}</p>}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">{formData.userName || 'No especificado'}</p>
              )}
            </div>

            {/* Apellidos */}
            <div className="mb-4">
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellidos</Label>
              {isEditing ? (
                <>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">{formData.lastName || 'No especificado'}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</Label>
              {isEditing ? (
                <>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </>
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">{formData.email || 'No especificado'}</p>
              )}
            </div>

            {/* Especialidad */}
            <div className="mb-4">
              <Label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Especialidad</Label>
              {isEditing ? (
                <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Ej: Desarrollo Web" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">{formData.specialty || 'No especificado'}</p>
              )}
            </div>

            {/* Biografía */}
            <div className="sm:col-span-2 mb-4">
              <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biografía</Label>
              {isEditing ? (
                <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" placeholder="Cuéntanos sobre ti..." />
              ) : (
                <p className="text-gray-900 whitespace-pre-line py-2 px-3 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">{formData.bio || 'No hay biografía disponible'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfileEditor;
