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

    public PromptResult createSummaryPromptResult(int level, String question) {
        StringBuilder systemPrompt = new StringBuilder();
        //공용 프롬포트 설정
        systemPrompt.append(promptProperties.getPromptCommon());
        //레벨에 따른 프롬포트 설정
        systemPrompt.append(promptProperties.getPrompts().getOrDefault(level, ""));
        systemPrompt.append("현재 내용을 핵심내용 위주로 요약 정리하여 마크다운 형식으로 줘. 내용: 을 앞에 붙여서 알려줘.");

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createTitlePromptResult(String question) {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("현재 요약본을 내용으로 게시글 작성할건데 알맞은 제목을 알려줘.");

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }
}