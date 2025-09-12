package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;


@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    Optional<Subcategory> findByNameAndCategoryId(String name, Long categoryId);

    @Query("SELECT s FROM Subcategory s WHERE s.category.id = :categoryId AND s.isActive = true ORDER BY s.sortOrder ASC, s.name ASC")
    List<Subcategory> findActiveByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT s FROM Subcategory s WHERE s.isActive = true ORDER BY s.category.sortOrder ASC, s.sortOrder ASC, s.name ASC")
    List<Subcategory> findAllActiveOrdered();

    @Query("SELECT s FROM Subcategory s WHERE s.isActive = true AND LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY s.category.sortOrder ASC, s.sortOrder ASC, s.name ASC")
    List<Subcategory> findActiveByNameContaining(@Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(s) > 0 FROM Subcategory s WHERE s.name = :name AND s.category.id = :categoryId AND s.id != :excludeId")
    boolean existsByNameAndCategoryIdAndIdNot(@Param("name") String name, @Param("categoryId") Long categoryId, @Param("excludeId") Long excludeId);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.subcategory.id = :subcategoryId AND c.isActive = true")
    long countActiveCoursesBySubcategoryId(@Param("subcategoryId") Long subcategoryId);

    @Query("SELECT s FROM Subcategory s LEFT JOIN FETCH s.courses c WHERE s.category.id = :categoryId AND s.isActive = true ORDER BY s.sortOrder ASC, s.name ASC")
    List<Subcategory> findActiveByCategoryIdWithCourses(@Param("categoryId") Long categoryId);
}
