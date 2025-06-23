package com.adela.hana_bridge_beapi.dto.openai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SummaryResponse {
    private String title;
    private String content;
    private String categoryName;

    public SummaryResponse(String title, String content, String categoryName) {
        this.title = title;
        this.content = content;
        this.categoryName = categoryName;
    }
}
