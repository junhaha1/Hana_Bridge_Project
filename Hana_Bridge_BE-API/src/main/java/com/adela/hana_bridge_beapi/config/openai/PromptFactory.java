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

    public PromptResult createSummaryPromptResult() {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("""
                블로그 게시글 스타일로 요약해줘.
                소제목, 자연스러운 문단 구성, 마크다운 포맷을 사용해서 작성해줘.
                전체 요약 내용에 대한 제목은 작성하지마.
                """);

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createTitlePromptResult(String question) {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("""
                현재 요약본을 내용으로 게시글용 제목 알려줘.
                제목은 깔끔하고 한눈에 어떤 내용들이 담겨져 있는 글인지 나타나야 돼.
                """);

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }
}