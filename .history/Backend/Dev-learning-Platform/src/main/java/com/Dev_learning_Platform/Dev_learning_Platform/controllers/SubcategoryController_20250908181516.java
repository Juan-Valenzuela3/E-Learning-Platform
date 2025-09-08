package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.services.SubcategoryService;

/**
 * Controlador REST para manejar operaciones de subcategorías
 */
@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    /**
     * Obtiene todas las subcategorías activas
     */
    @GetMapping
    public ResponseEntity<List<Subcategory>> getAllActiveSubcategories() {
        try {
            List<Subcategory> subcategories = subcategoryService.getAllActiveSubcategories();
            return ResponseEntity.ok(subcategories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene todas las subcategorías (incluyendo inactivas) - Solo para administradores
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Subcategory>> getAllSubcategories() {
        try {
            List<Subcategory> subcategories = subcategoryService.getAllSubcategories();
            return ResponseEntity.ok(subcategories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene una subcategoría por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subcategory> getSubcategoryById(@PathVariable Long id) {
        try {
            Optional<Subcategory> subcategory = subcategoryService.getSubcategoryById(id);
            if (subcategory.isPresent()) {
                return ResponseEntity.ok(subcategory.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene todas las subcategorías de una categoría específica
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Subcategory>> getSubcategoriesByCategoryId(@PathVariable Long categoryId) {
        try {
            List<Subcategory> subcategories = subcategoryService.getSubcategoriesByCategoryId(categoryId);
            return ResponseEntity.ok(subcategories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Busca subcategorías por término de búsqueda
     */
    @GetMapping("/search")
    public ResponseEntity<List<Subcategory>> searchSubcategories(@RequestParam(required = false) String q) {
        try {
            List<Subcategory> subcategories = subcategoryService.searchSubcategories(q);
            return ResponseEntity.ok(subcategories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crea una nueva subcategoría - Solo para administradores
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSubcategory(@RequestBody Subcategory subcategory) {
        try {
            Subcategory createdSubcategory = subcategoryService.createSubcategory(subcategory);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSubcategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Actualiza una subcategoría existente - Solo para administradores
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubcategory(@PathVariable Long id, @RequestBody Subcategory subcategoryDetails) {
        try {
            Subcategory updatedSubcategory = subcategoryService.updateSubcategory(id, subcategoryDetails);
            return ResponseEntity.ok(updatedSubcategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Elimina una subcategoría (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubcategory(@PathVariable Long id) {
        try {
            subcategoryService.deleteSubcategory(id);
            return ResponseEntity.ok().body(new SuccessResponse("Subcategoría eliminada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Elimina permanentemente una subcategoría
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<?> permanentDeleteSubcategory(@PathVariable Long id) {
        try {
            subcategoryService.permanentDeleteSubcategory(id);
            return ResponseEntity.ok().body(new SuccessResponse("Subcategoría eliminada permanentemente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Activa una subcategoría
     */
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateSubcategory(@PathVariable Long id) {
        try {
            Subcategory subcategory = subcategoryService.activateSubcategory(id);
            return ResponseEntity.ok(subcategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Desactiva una subcategoría
     */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateSubcategory(@PathVariable Long id) {
        try {
            Subcategory subcategory = subcategoryService.deactivateSubcategory(id);
            return ResponseEntity.ok(subcategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Clase para respuestas de error
     */
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    /**
     * Clase para respuestas de éxito
     */
    public static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
