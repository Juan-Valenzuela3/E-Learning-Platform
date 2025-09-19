// src/services/categoryService.js
import api from "./api";

export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    throw new Error(
      error.response?.data?.message || "Error al cargar las categorías"
    );
  }
};

export const getSubcategories = async () => {
  try {
    const response = await api.get("/api/subcategories");
    return response.data;
  } catch (error) {
    console.error("Error al cargar las subcategorías:", error);
    throw new Error(
      error.response?.data?.message || "Error al cargar las subcategorías"
    );
  }
};

export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar las subcategorías:", error);
    throw new Error(
      error.response?.data?.message || "Error al cargar las subcategorías"
    );
  }
};
