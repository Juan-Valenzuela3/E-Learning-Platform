import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Camera, Mail, Phone } from 'lucide-react';

const SettingsSection = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const TeacherSettings = () => {
  const [profile, setProfile] = useState({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    phone: '+1 234 567 8900',
    bio: 'Profesor de programación con más de 10 años de experiencia en desarrollo web y móvil.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    studentMessages: true,
    weeklyReports: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona tu perfil, notificaciones y preferencias de privacidad
        </p>
      </div>

      {/* Perfil */}
      <SettingsSection title="Información del Perfil" icon={User}>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Foto de perfil</h3>
              <p className="text-sm text-gray-500">JPG, GIF o PNG. Máximo 1MB.</p>
              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                Cambiar foto
              </button>
            </div>
          </div>

          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Teléfono
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Cuéntanos sobre tu experiencia y especialidades..."
            />
          </div>
        </div>
      </SettingsSection>

      {/* Notificaciones */}
      <SettingsSection title="Notificaciones" icon={Bell}>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {key === 'emailNotifications' && 'Notificaciones por email'}
                  {key === 'pushNotifications' && 'Notificaciones push'}
                  {key === 'courseUpdates' && 'Actualizaciones de cursos'}
                  {key === 'studentMessages' && 'Mensajes de estudiantes'}
                  {key === 'weeklyReports' && 'Reportes semanales'}
                </h3>
                <p className="text-sm text-gray-500">
                  {key === 'emailNotifications' && 'Recibe notificaciones en tu correo electrónico'}
                  {key === 'pushNotifications' && 'Recibe notificaciones en tiempo real'}
                  {key === 'courseUpdates' && 'Notificaciones sobre cambios en tus cursos'}
                  {key === 'studentMessages' && 'Alertas cuando recibas mensajes de estudiantes'}
                  {key === 'weeklyReports' && 'Resumen semanal de actividad'}
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Privacidad */}
      <SettingsSection title="Privacidad y Seguridad" icon={Shield}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidad del perfil
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="public">Público</option>
              <option value="students">Solo estudiantes</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Mostrar email en perfil</h3>
                <p className="text-sm text-gray-500">Los estudiantes podrán ver tu email</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showEmail ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Mostrar teléfono en perfil</h3>
                <p className="text-sm text-gray-500">Los estudiantes podrán ver tu teléfono</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showPhone ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Permitir mensajes directos</h3>
                <p className="text-sm text-gray-500">Los estudiantes pueden enviarte mensajes</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.allowMessages ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Save className="h-5 w-5 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default TeacherSettings;
