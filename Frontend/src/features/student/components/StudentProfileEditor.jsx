import React, { useState, useRef, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Pencil, Save, X } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { EyeOff, Eye } from 'lucide-react';

// Componente para editar el perfil con rol de estudiante
export default function StudentProfileEditor() {
  // aqui estamos utilizando un contexto de autenticacion para obtener los datos del usuario autenticado
  const { fetchProfile, updateProfile, role } = useContext(AuthContext);

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
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const profile = await fetchProfile();
        setUserData({
          userName: profile.name || '',
          lastName: profile.lastname || '',
          email: profile.email || '',
          password: profile.password || '',
          occupation: profile.occupation || '',
          avatar: profile.avatar || '',
        });
        setInitialData(profile);
      } catch (e) {
        setBanner({ type: 'error', message: e?.response?.data?.message || 'No se pudo cargar el perfil' });
      } finally {
        setLoading(false);
      }
    };
    load();

  }, []);

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
    if (!userData.email.trim()) newErr.email = 'El correo es obligatorio';
    if (!userData.password.trim()) newErr.password = 'La contraseña es obligatoria';
    if (!userData.lastName.trim()) newErr.lastName = 'El apellido es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) newErr.email = 'Correo inválido';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setBanner({ type: 'error', message: 'Corrige los errores del formulario' });
      return;
    }
    try {
      setSaving(true);
      const updated = await updateProfile({
        userName: userData.userName,
        email: userData.email,
        lastName: userData.lastName,
        password: userData.password,
        occupation: userData.occupation,
        avatar: userData.avatar,
      });
      setUserData({
        userName: updated.userName,
        email: updated.email,
        lastName: updated.lastName,
        password: updated.password,
        occupation: updated.occupation || '',
        avatar: updated.avatar || '',
      });
      setInitialData(updated);
      setIsEditing(false);
      setBanner({ type: 'success', message: 'Perfil actualizado correctamente' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el perfil';
      setBanner({ type: 'error', message: msg });
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

  const titleByRole = role === 'teacher' ? 'Perfil del Instructor' : 'Perfil del Estudiante';
  const subtitleByRole = isEditing ? 'Actualiza tu información personal' : 'Detalles de tu cuenta';

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {loading ? 'Cargando…' : (isEditing ? 'Editar Perfil' : titleByRole)}
              </CardTitle>
              <CardDescription className="text-blue-100">
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
            <div className="text-center text-gray-600">Cargando perfil…</div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-blue-100 shadow-lg">
                    <AvatarImage 
                    src={userData.avatar || getFallbackAvatar(userData.userName)}
                    alt={userData.userName}
                    onError={(e) => {e.target.src = getFallbackAvatar(userData.userName)}}
                    />
                    <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
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
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData.userName}</h2>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData.lastName}</h2>
                <p className="text-gray-200 bg-blue-700/50 px-2 py-0.5 rounded text-xs mt-1 capitalize">{role}</p>
                <p className="text-gray-600">{userData.occupation}</p>

              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Correo Electrónico</h4>
                      <p className="mt-1 text-gray-900 break-all">{userData.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Ocupación</h4>
                      <p className="mt-1 text-gray-900">{userData.occupation || '—'}</p>
                    </div>
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
                      className="bg-blue-600 hover:bg-blue-700 flex items-center disabled:opacity-60"
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