package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleSummaryResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import com.adela.hana_bridge_beapi.dto.openai.ClientResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientSummaryRequest;
import com.adela.hana_bridge_beapi.dto.openai.SummaryResponse;
import com.adela.hana_bridge_beapi.dto.prompt.PromptRequest;
import com.adela.hana_bridge_beapi.dto.prompt.PromptResponse;
import com.adela.hana_bridge_beapi.dto.prompt.PromptUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.service.*;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class OpenAiApiController {

    private final MeterRegistry meterRegistry;
    private final OpenAiService openAiService;
    private final TokenService tokenService;
    private final UsersService usersService;
    private final AssembleBoardService assembleBoardService;
    private final PromptService promptService;

    @GetMapping("/prompt")
    public ResponseEntity<List<PromptResponse>> getPrompts(@RequestHeader("Authorization") String authHeader) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        Users user = usersService.findByEmail(email);
        List<PromptResponse> prompts = promptService.getPromptsForUser(user.getId())
                .stream()
                .map(prompt -> PromptResponse.builder()
                        .promptId(prompt.getPromptId())
                        .name(prompt.getName())
                        .role(prompt.getRole())
                        .form(prompt.getForm())
                        .level(prompt.getLevel())
                        .option(prompt.getOption())
                        .build()
                )
                .toList();
        return ResponseEntity.ok().body(prompts);
    }
    @PostMapping("/prompt/user")
    public ResponseEntity<Void> addPrompt(@RequestHeader("Authorization") String authHeader, @RequestBody PromptRequest promptRequest) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        //해당 사용자가 맞는지 검증
        Users user = usersService.findByEmail(email);
        promptRequest.connectUserEntity(user);
        promptService.addPrompt(promptRequest);

        return ResponseEntity.ok().build();
    }

    @PutMapping ("/prompt/user")
    public ResponseEntity<PromptResponse> updatePrompt(@RequestHeader("Authorization") String authHeader, @RequestBody PromptUpdateRequest promptUpdateRequest) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        //해당 사용자가 맞는지 검증
        usersService.findByEmail(email);
        PromptResponse promptResponse = promptService.updatePrompt(promptUpdateRequest);

        return ResponseEntity.ok().body(promptResponse);
    }

    @DeleteMapping("/prompt/{promptId}")
    public ResponseEntity<Void> deletePrompt(@RequestHeader("Authorization") String authHeader, @PathVariable Long promptId) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        //해당 사용자가 맞는지 검증
        Users user = usersService.findByEmail(email);
        promptService.deletePrompt(promptId);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/answer")
    public ResponseEntity<ClientResponse> askQuestion(@RequestBody ClientRequest clientRequest){
        String answer = openAiService.askChatGPT(clientRequest);
        return ResponseEntity.ok().body(new ClientResponse(answer));
    }

    @PostMapping(value = "/answer/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseBodyEmitter streamAnswer(@RequestHeader("Authorization") String authHeader, @RequestBody ClientRequest clientRequest) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);
        usersService.updateQuestionCount(userId);

        ResponseBodyEmitter emitter = new ResponseBodyEmitter();
        openAiService.streamAnswerToClient(clientRequest, emitter);
        return emitter;
    }

    @PostMapping("/summary")
    public ResponseEntity<SummaryResponse> askQuestionSummary(@RequestHeader("Authorization") String authHeader, @RequestBody ClientSummaryRequest clientSummaryRequest){
        Timer.Sample sample = Timer.start(meterRegistry); // ⏱️ 측정 시작

        try{
            String accessToken = authHeader.replace("Bearer ", "");
            Long userId = tokenService.findUsersIdByToken(accessToken);


            //질문과 답변들을 이용하여 요약본 생성
            String summary = openAiService.summaryChatGPT(clientSummaryRequest);
            //요약본을 바탕으로 제목 생성
            String title = openAiService.titleChatGPT(summary);

            String categoryName = openAiService.categoryChatGPT(title);

            SummaryResponse summaryResponse = new SummaryResponse(title, summary, categoryName);
            usersService.updateSummaryCount(userId);
            usersService.addSummaryCount(userId);

            System.out.printf("요약된 제목 : %s\n 카테고리 : %s\n", title,categoryName);

            return ResponseEntity.ok().body(summaryResponse);
        } finally {
            sample.stop( // ⏹️ 측정 종료 + 메트릭 등록
                    Timer.builder("custom.summary.response.time")
                            .description("응답 시간 측정용 타이머")
                            .tag("uri", "/summary")
                            .register(meterRegistry)
            );
        }
    }
}
