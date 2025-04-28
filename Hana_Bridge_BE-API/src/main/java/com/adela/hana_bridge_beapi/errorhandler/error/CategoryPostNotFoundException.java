package com.adela.hana_bridge_beapi.errorhandler.error;

public class CategoryPostNotFoundException extends IllegalArgumentException {
    public CategoryPostNotFoundException(String category) {
        super("Category not found with category: " + category);
    }
}
