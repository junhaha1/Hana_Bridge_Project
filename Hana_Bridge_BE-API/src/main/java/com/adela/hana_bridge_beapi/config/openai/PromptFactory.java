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
                핵심 개념과 흐름을 반드시 프로그래밍 예제 코드와 함께 설명해줘.
                
                코드 없이 설명하는 부분이 없도록 해줘.

                문서는 기술 문서 게시글 형식으로 구성하고,

                소제목, 자연스러운 문단, 마크다운 문법을 사용해 정돈해줘.

                문서 내에 오타(자연어 + 코드) 또는 잘못된 마크다운 문법이 있으면 수정해줘.

                최종 결과에는 제목을 작성하지 마.
                """);

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createTitlePromptResult() {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("""
                현재 요약본을 내용으로 게시글용 제목 알려줘.
                제목은 깔끔하고 한눈에 어떤 내용들이 담겨져 있는 글인지 나타나야 돼.
                """);

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }

    public PromptResult createCegoryPromptResult() {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("""
                카테고리 정보를 보고 해당 제목를 토대로 카테고리 번호 1개만 분류.
                제목에 해당 이름이 없으면 45 기타 문서로 분류.
                   번호  이름
                   10	Python
                   11	Java
                   12	JavaScript
                   13	TypeScript
                   14	C / C++
                   15	기타 언어
                   16	Linux
                   17	Ubuntu
                   18	CentOS
                   19	기타 Linux 배포판
                   20	Windows
                   21	macOS
                   22	WSL (Windows Subsystem for Linux)
                   23	SQL 쿼리
                   24	MySQL
                   25	Oracle
                   26	PostgreSQL
                   27	NoSQL
                   28	React
                   29	Spring Boot
                   30	Django
                   31	Vue.js
                   32	Next.js
                   33	Flask
                   34	AWS
                   35	KT Cloud
                   36	Azure
                   37	Docker / 컨테이너
                   38	Kubernetes
                   39	Nginx / Apache
                   40	CI/CD
                   41	DevOps
                   42	코딩 테스트
                   43	알고리즘 이론
                   44	Git / GitHub
                   45	기타 문서
                """);

        System.out.println(systemPrompt.toString());
        return new PromptResult(systemPrompt.toString().trim(), maxTokens, temperature);
    }
}