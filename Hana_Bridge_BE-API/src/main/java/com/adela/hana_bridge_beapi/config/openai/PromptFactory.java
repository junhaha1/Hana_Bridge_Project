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

    //사용자가 입력한 프롬포트로 생성
    public PromptResult createCustomPromptResult(String role, String form, String level, String option, String question) {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append(role).append('\n');
        systemPrompt.append(form).append('\n');
        systemPrompt.append(level).append('\n');
        systemPrompt.append(option).append('\n');

        promptProperties.toKeywordPromptMap().forEach((keyword, addition)->{
            if (question.contains(keyword)){
                systemPrompt.append(addition);
            }
        });
        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    //시스템 기본값으로 프롬포트 생성
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
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createSummaryPromptResult(int level, String question) {
        StringBuilder systemPrompt = new StringBuilder();
        //공용 프롬포트 설정
        systemPrompt.append(promptProperties.getPromptCommon());
        //레벨에 따른 프롬포트 설정
        systemPrompt.append(promptProperties.getPrompts().getOrDefault(level, ""));
        systemPrompt.append("현재 내용을 핵심내용 위주로 요약 정리하여 마크다운 형식으로 줘.");

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createTitlePromptResult(String question) {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("현재 요약본을 내용으로 게시글 작성할건데 알맞은 제목을 알려줘." +
                "혹시 마크 다운 사용할거면 앞에 제목: 이런건 없애줘.");

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }
}