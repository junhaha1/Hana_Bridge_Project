package com.adela.hana_bridge_beapi.config.openai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "openai")
public class PromptConfig {
    private Map<Integer, String> prompts;
}
