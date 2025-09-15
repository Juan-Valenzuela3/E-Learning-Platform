import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Pencil, Save, X, User, Mail, Briefcase, RefreshCw, AlertCircle, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


// Componente para editar el perfil con rol de estudiante
export default function StudentProfileEditor() {
  // aqui estamos utilizando un contexto de autenticacion para obtener los datos del usuario autenticado
  const { user, updateProfile } = useAuth();

  //Aqui estamos utilizando el useState para los estado de los componentes
  const [userData, setUserData] = useState({
    userName: '',
    lastName: '',
    email: '',
    password: '',
    occupation: '',
    avatar: ''
  });
  const [initialData, setInitialData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);


  //Utilizamos un useEffect para poder cargar los datos del usuario autenticado

  const loadProfile = async () => {
    console.log("Loading profile for user:", user);
  
    if (!user) {
      console.log("No user found in context");
      setBanner({ type: "error", message: "No hay usuario autenticado" });
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      setBanner({ type: "", message: "" }); // Limpiar errores previos
  
      const response = await api.get("/users/profile");
      console.log("Profile loaded from service:", response.data);
  
      // Mapeamos los datos de la API a nuestro state
      const profileData = {
        id: response.data.id,
        userName: response.data.userName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.isActive,
      };
  
      setProfile(profileData);
      console.log("Mapped profile data:", profileData);
  
      // Si tienes otros states relacionados
      setUserData(profileData);
      setInitialData(profileData);
  
    } catch (e) {
      console.error("Error loading profile:", e);
      setBanner({
        type: "error",
        message:
          e?.response?.data?.message ||
          "No se pudo cargar el perfil. Verifica que estés autenticado correctamente.",
      });
    } finally {
      setLoading(false);
    }
  };
  
    

  //Se agregan una funcion de para manejar los cambios en los formularios

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (banner.message) setBanner({ type: '', message: '' });
  };

  const validate = () => {
    const newErr = {};
    if (!userData.userName.trim()) newErr.userName = 'El nombre es obligatorio';
    if (!userData.lastName.trim()) newErr.lastName = 'El apellido es obligatorio';
    if (!userData.email.trim()) newErr.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) newErr.email = 'Correo inválido';
    // La contraseña es opcional para actualización
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setBanner({ type: 'error', message: 'Corrige los errores del formulario' });
      return;
    }

    setSaving(true);
    setBanner({ type: '', message: '' });

    try {
      const updateData = {
        name: userData.userName,
        lastName: userData.lastName,
        email: userData.email,
        occupation: userData.occupation,
        avatar: userData.avatar,
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (userData.password && userData.password.trim()) {
        updateData.password = userData.password;
      }

      // Actualizar perfil usando el contexto para que se refleje en el sidebar
      await updateProfile(updateData);
      setInitialData(userData);
      setIsEditing(false);
      setBanner({ type: 'success', message: 'Perfil actualizado correctamente' });
    } catch (e) {
      console.error('Error updating profile:', e);
      setBanner({ type: 'error', message: e?.response?.data?.message || 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && !saving) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData(prev => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getFallbackAvatar = (name) => {
    const initials = name ? name.split('').map(n => n[0]).join('').toUpperCase() : 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0D8ABC&color=fff&font-size=0.3&length=2`;
  }

  const titleByRole = user?.role === 'teacher' ? 'Perfil del Instructor' : 'Perfil del Estudiante';
  const subtitleByRole = isEditing ? 'Actualiza tu información personal' : 'Detalles de tu cuenta';

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {loading ? 'Cargando…' : (isEditing ? 'Editar Perfil' : titleByRole)}
              </CardTitle>
              <CardDescription className="text-red-100">
                {subtitleByRole}
              </CardDescription>
            </div>
            {!loading && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {banner.message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${banner.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {banner.message}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-red-500 mb-4" />
              <p className="text-gray-600">Cargando perfil...</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
              <p className="text-gray-600">No hay usuario autenticado</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-red-100 shadow-lg">
                    <AvatarImage 
                    src={userData.avatar || getFallbackAvatar(userData.userName)}
                    alt={userData.userName}
                    onError={(e) => {e.target.src = getFallbackAvatar(userData.userName)}}
                    />
                    <AvatarFallback className="text-3xl bg-red-100 text-red-600">
                      {getInitials(userData.userName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Pencil className="h-6 w-6 text-white" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {userData.userName} {userData.lastName}
                </h2>
                <p className="text-white bg-red-500 px-3 py-1 rounded-full text-sm mt-2 capitalize font-medium">
                  {user?.role || 'Estudiante'}
                </p>
                <p className="text-gray-600 mt-1">{userData.occupation || 'Sin ocupación especificada'}</p>

              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center mb-2">
                        <Mail className="h-4 w-4 text-red-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">Correo Electrónico</h4>
                      </div>
                      <p className="text-gray-900 break-all">{userData.email || 'No especificado'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-4 w-4 text-red-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-700">Ocupación</h4>
                      </div>
                      <p className="text-gray-900">{userData.occupation || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar Información
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nombres
                      </Label>
                      <Input
                        id="userName"
                        name="userName"
                        value={userData.userName || ''}
                        onChange={handleChange}
                        disabled={saving}
                        className={`mt-1 ${errors.userName ? 'border-red-500' : ''}`}
                      />
                      {errors.userName && <p className="text-xs text-red-600 mt-1">{errors.userName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Apellidos
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName || ''}
                        onChange={handleChange}
                        disabled={saving}
                        className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Nueva Contraseña
                      </Label>


                      <Input

                        id="password"
                        name="password"
                        type="password"
                        value={userData.password || ''}
                        onChange={handleChange}
                        disabled={saving}
                        className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email || ''}
                        onChange={handleChange}
                        disabled={saving}
                        className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">
                        Ocupación
                      </Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={userData.occupation || ''}
                        onChange={handleChange}
                        disabled={saving}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setIsEditing(false); setUserData(initialData || userData); setErrors({}); setBanner({ type: '', message: '' }); }}
                      className="flex items-center"
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 flex items-center disabled:opacity-60"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Guardando…' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}