package com.adela.hana_bridge_beapi.config.openai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "openai")
public class PromptProperties {
    private String promptCommon;
    private Map<Integer, String> prompts;
    private List<KeywordPrompt> keywordPromptsList;

    @Getter
    @Setter
    public static class KeywordPrompt {
        private String key;
        private String value;
    }

    public Map<String, String> toKeywordPromptMap() {
        return keywordPromptsList.stream()
                .collect(Collectors.toMap(KeywordPrompt::getKey, KeywordPrompt::getValue));
    }
}
