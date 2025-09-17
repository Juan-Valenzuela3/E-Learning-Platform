import ProfileService from "@/services/profileService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";


export const useProfileForm = (profileService) =>{
const [formData, setFormData] = useState({
    userName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
    bio: '',
    specialty: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: ''
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
          profileImageUrl: userData.profileImageUrl || null,
          bio: userData.bio || '',
          specialty: userData.specialty || '',
          website: userData.website || '',
          twitter: userData.twitter || '',
            linkedin: userData.linkedin || '',
            github: userData.github || ''
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.userName?.trim()) newErrors.userName = 'El nombre es obligatorio.';
    else if (formData.userName.trim().length < 2 || formData.userName.trim().length > 50) {
      newErrors.userName = 'El nombre debe tener entre 2 y 50 caracteres.';
    }
    // Añade la validación de solo letras y espacios si es necesario
    if (!formData.lastName?.trim()) newErrors.lastName = 'El apellido es obligatorio.';
    else if (formData.lastName.trim().length < 2 || formData.lastName.trim().length > 50) {
      newErrors.lastName = 'El apellido debe tener entre 2 y 50 caracteres.';
    }
    // Añade la validación de solo letras y espacios si es necesario
    if (!formData.email?.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'El formato del correo es inválido.';
    }

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
     if (!validate()){
       toast.error("Por favor corrige los errores en el formulario.")
       return;
     }
     const dataToSend = {
       userName: formData.userName,
       lastName: formData.lastName,
       email: formData.email,

       profileImageUrl: formData.profileImageUrl || null,
       bio: formData.bio || null,
       specialty: formData.specialty || null,
       website: formData.website || null,
       twitter: formData.twitter || null,
       linkedin: formData.linkedin || null,
       github: formData.github || null,
     };

     setUpdating(true);
     setError(null);
     try {
       const updatedUser = await profileService.updateProfile(dataToSend);
       setFormData(updatedUser);
       setOriginalData(updatedUser);
       toast.success("Perfil actualizado correctamente ✅");
       setIsEditing(false);
     } catch (err) {
       console.error('Error updating profile:', err);

       const backendMessage = err?.response?.data?.message;
       if (backendMessage) {
         toast.error(backendMessage);
         setError(backendMessage);
       } else {
         toast.error('Error al actualizar el perfil');
         setError('Error al actualizar el perfil');
       }
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




  return{

    formData,
    loading,
    updating,
    error,
    isEditing,
    errors,
    handleCancel,
    handleChange,
    handleSave,
    setIsEditing
  };

}