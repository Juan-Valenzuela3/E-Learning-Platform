package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPublicDto implements Serializable {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private Boolean isActive;
    private Integer sortOrder;
    private List<SubcategoryPublicDto> subcategories;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubcategoryPublicDto implements Serializable {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String color;
        private Boolean isActive;
        private Integer sortOrder;
    }
}
