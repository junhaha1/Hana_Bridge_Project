package com.adela.hana_bridge_beapi.config.openai;

import com.adela.hana_bridge_beapi.dto.openai.PromptResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PromptFactory {
    private final PromptProperties promptProperties;

    //기본값
    private int maxTokens = 500;
    private double temperature = 0.4;

    public PromptResult createPromptResult(int level, String question) {
        StringBuilder systemPrompt = new StringBuilder();
        //공용 프롬포트 설정
        systemPrompt.append(promptProperties.getPromptCommon());
        //레벨에 따른 프롬포트 설정
        systemPrompt.append(promptProperties.getPrompts().getOrDefault(level, ""));

        //키워드에 따른 프롬포트 추가
        promptProperties.toKeywordPromptMap().forEach((keyword, addition)->{
            if (question.contains(keyword)){
                systemPrompt.append(addition);
            }
        });

        System.out.println(systemPrompt.toString());

//        // 토큰 조절
//        if(level == 0){
//            maxTokens = 500;
//        }
//        if (question.matches(".*100자.*|.*간단.*|.*짧게.*")) {
//            maxTokens = 150;
//        } else if (question.matches(".*자세히.*|.*길게.*|.*1000자.*")) {
//            maxTokens = 600;
//        }
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }
}
