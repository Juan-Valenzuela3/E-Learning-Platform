// src/services/uploadService.js
import axios from 'axios';

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  //en endpoint para futura implementacio para el cambio de imagen de perfil
  const response = await axios.post('/api/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  // Retornamos la URL que el backend nos envía
  return response.data.url;
};

export default {
  uploadImage,
};