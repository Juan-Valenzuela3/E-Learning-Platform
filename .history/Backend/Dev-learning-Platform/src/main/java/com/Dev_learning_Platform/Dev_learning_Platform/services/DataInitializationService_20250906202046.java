package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;

/**
 * Servicio para inicializar datos por defecto de categorías y subcategorías
 */
@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SubcategoryService subcategoryService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeDefaultCategories();
    }

    /**
     * Inicializa las categorías y subcategorías por defecto
     */
    private void initializeDefaultCategories() {
        // Crear categoría Frontend
        Category frontend = createCategoryIfNotExists("Frontend", 
            "Desarrollo de interfaces de usuario y experiencias web", 
            "fas fa-laptop-code", "#3B82F6", 1);

        // Crear categoría Backend
        Category backend = createCategoryIfNotExists("Backend", 
            "Desarrollo de servidores, APIs y lógica de negocio", 
            "fas fa-server", "#10B981", 2);

        // Crear categoría Data Science
        Category dataScience = createCategoryIfNotExists("Data Science", 
            "Análisis de datos, machine learning y estadística", 
            "fas fa-chart-line", "#F59E0B", 3);

        // Crear categoría IA
        Category ai = createCategoryIfNotExists("Inteligencia Artificial", 
            "Machine Learning, Deep Learning y algoritmos inteligentes", 
            "fas fa-robot", "#8B5CF6", 4);

        // Crear subcategorías para Frontend
        createSubcategoryIfNotExists("React", "Biblioteca de JavaScript para interfaces de usuario", 
            "fab fa-react", "#61DAFB", 1, frontend);
        createSubcategoryIfNotExists("Vue.js", "Framework progresivo de JavaScript", 
            "fab fa-vuejs", "#4FC08D", 2, frontend);
        createSubcategoryIfNotExists("Angular", "Framework de desarrollo web de Google", 
            "fab fa-angular", "#DD0031", 3, frontend);
        createSubcategoryIfNotExists("JavaScript", "Lenguaje de programación web", 
            "fab fa-js-square", "#F7DF1E", 4, frontend);
        createSubcategoryIfNotExists("TypeScript", "JavaScript con tipado estático", 
            "fab fa-js", "#3178C6", 5, frontend);
        createSubcategoryIfNotExists("HTML/CSS", "Lenguajes de marcado y estilos", 
            "fab fa-html5", "#E34F26", 6, frontend);
        createSubcategoryIfNotExists("Svelte", "Framework compilado de JavaScript", 
            "fas fa-code", "#FF3E00", 7, frontend);

        // Crear subcategorías para Backend
        createSubcategoryIfNotExists("Java", "Lenguaje de programación orientado a objetos", 
            "fab fa-java", "#ED8B00", 1, backend);
        createSubcategoryIfNotExists("Spring Boot", "Framework de Java para aplicaciones web", 
            "fas fa-leaf", "#6DB33F", 2, backend);
        createSubcategoryIfNotExists("Python", "Lenguaje de programación versátil", 
            "fab fa-python", "#3776AB", 3, backend);
        createSubcategoryIfNotExists("Django", "Framework web de Python", 
            "fas fa-code", "#092E20", 4, backend);
        createSubcategoryIfNotExists("Node.js", "Runtime de JavaScript para backend", 
            "fab fa-node-js", "#339933", 5, backend);
        createSubcategoryIfNotExists("Express.js", "Framework web minimalista para Node.js", 
            "fas fa-server", "#000000", 6, backend);
        createSubcategoryIfNotExists("C#", "Lenguaje de programación de Microsoft", 
            "fab fa-microsoft", "#239120", 7, backend);
        createSubcategoryIfNotExists(".NET", "Framework de desarrollo de Microsoft", 
            "fab fa-microsoft", "#512BD4", 8, backend);
        createSubcategoryIfNotExists("PHP", "Lenguaje de programación para web", 
            "fab fa-php", "#777BB4", 9, backend);
        createSubcategoryIfNotExists("Laravel", "Framework web de PHP", 
            "fab fa-laravel", "#FF2D20", 10, backend);

        // Crear subcategorías para Data Science
        createSubcategoryIfNotExists("Python", "Lenguaje principal para data science", 
            "fab fa-python", "#3776AB", 1, dataScience);
        createSubcategoryIfNotExists("R", "Lenguaje estadístico y de análisis de datos", 
            "fab fa-r-project", "#276DC3", 2, dataScience);
        createSubcategoryIfNotExists("Pandas", "Biblioteca de Python para análisis de datos", 
            "fas fa-table", "#150458", 3, dataScience);
        createSubcategoryIfNotExists("NumPy", "Biblioteca de Python para computación numérica", 
            "fas fa-calculator", "#013243", 4, dataScience);
        createSubcategoryIfNotExists("Matplotlib", "Biblioteca de Python para visualización", 
            "fas fa-chart-bar", "#11557C", 5, dataScience);
        createSubcategoryIfNotExists("Seaborn", "Biblioteca de Python para visualización estadística", 
            "fas fa-chart-area", "#000000", 6, dataScience);
        createSubcategoryIfNotExists("SQL", "Lenguaje de consulta de bases de datos", 
            "fas fa-database", "#336791", 7, dataScience);
        createSubcategoryIfNotExists("Excel", "Herramienta de análisis de datos", 
            "fas fa-file-excel", "#217346", 8, dataScience);
        createSubcategoryIfNotExists("Tableau", "Herramienta de visualización de datos", 
            "fas fa-chart-pie", "#E97627", 9, dataScience);
        createSubcategoryIfNotExists("Power BI", "Herramienta de business intelligence de Microsoft", 
            "fas fa-chart-line", "#F2C811", 10, dataScience);

        // Crear subcategorías para IA
        createSubcategoryIfNotExists("Machine Learning", "Algoritmos que aprenden de los datos", 
            "fas fa-brain", "#FF6B6B", 1, ai);
        createSubcategoryIfNotExists("Deep Learning", "Redes neuronales profundas", 
            "fas fa-network-wired", "#4ECDC4", 2, ai);
        createSubcategoryIfNotExists("TensorFlow", "Framework de machine learning de Google", 
            "fab fa-tensorflow", "#FF6F00", 3, ai);
        createSubcategoryIfNotExists("PyTorch", "Framework de machine learning de Facebook", 
            "fas fa-fire", "#EE4C2C", 4, ai);
        createSubcategoryIfNotExists("Scikit-learn", "Biblioteca de machine learning para Python", 
            "fas fa-cogs", "#F7931E", 5, ai);
        createSubcategoryIfNotExists("OpenCV", "Biblioteca de visión por computadora", 
            "fas fa-eye", "#5C3EE8", 6, ai);
        createSubcategoryIfNotExists("NLP", "Procesamiento de lenguaje natural", 
            "fas fa-language", "#00D4AA", 7, ai);
        createSubcategoryIfNotExists("Computer Vision", "Visión por computadora", 
            "fas fa-camera", "#FF4081", 8, ai);
        createSubcategoryIfNotExists("Reinforcement Learning", "Aprendizaje por refuerzo", 
            "fas fa-gamepad", "#9C27B0", 9, ai);
        createSubcategoryIfNotExists("ChatGPT/LLMs", "Modelos de lenguaje grandes", 
            "fas fa-comments", "#00BCD4", 10, ai);
    }

    /**
     * Crea una categoría si no existe
     */
    private Category createCategoryIfNotExists(String name, String description, String icon, String color, Integer sortOrder) {
        Optional<Category> existingCategory = categoryService.getCategoryByName(name);
        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIcon(icon);
        category.setColor(color);
        category.setSortOrder(sortOrder);
        category.setIsActive(true);

        return categoryService.createCategory(category);
    }

    /**
     * Crea una subcategoría si no existe
     */
    private Subcategory createSubcategoryIfNotExists(String name, String description, String icon, String color, Integer sortOrder, Category category) {
        Optional<Subcategory> existingSubcategory = subcategoryService.getSubcategoryByNameAndCategoryId(name, category.getId());
        if (existingSubcategory.isPresent()) {
            return existingSubcategory.get();
        }

        Subcategory subcategory = new Subcategory();
        subcategory.setName(name);
        subcategory.setDescription(description);
        subcategory.setIcon(icon);
        subcategory.setColor(color);
        subcategory.setSortOrder(sortOrder);
        subcategory.setIsActive(true);
        subcategory.setCategory(category);

        return subcategoryService.createSubcategory(subcategory);
    }
}
