package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleSummaryResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import com.adela.hana_bridge_beapi.dto.openai.ClientResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientSummaryRequest;
import com.adela.hana_bridge_beapi.dto.prompt.PromptRequest;
import com.adela.hana_bridge_beapi.dto.prompt.PromptResponse;
import com.adela.hana_bridge_beapi.dto.prompt.PromptUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class OpenAiApiController {

    private final OpenAiService openAiService;
    private final TokenService tokenService;
    private final UsersService usersService;
    private final AssembleBoardService assembleBoardService;
    private final PromptService promptService;

    @GetMapping("/prompt")
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
        String email = tokenService.findEmailByToken(accessToken);

        //해당 사용자가 맞는지 검증
        usersService.findByEmail(email);

        ResponseBodyEmitter emitter = new ResponseBodyEmitter();
        openAiService.streamAnswerToClient(clientRequest, emitter);

        return emitter;
    }

    @PostMapping("/summary")
    public ResponseEntity<AssembleSummaryResponse> askQuestionSummary(@RequestHeader("Authorization") String authHeader, @RequestBody ClientSummaryRequest clientSummaryRequest){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        //질문과 답변들을 이용하여 요약본 생성
        String summary = openAiService.summaryChatGPT(clientSummaryRequest);
        //요약본을 바탕으로 제목 생성
        String title = openAiService.titleChatGPT(summary);

        //양끝에 ""문자 없애기
        if (title.startsWith("\"") && title.endsWith("\"")) {
            title = title.substring(1, title.length() - 1);
        }

        if (title.startsWith("###")) {
            title = title.replace("###", "").trim();
        }

        if (title.startsWith("제목:")) {
            title = title.replace("제목:", "").trim();
        }

        if (summary.startsWith("요약:")){
            summary = summary.replace("요약:", "").trim();
        }

        if (summary.startsWith("내용:")){
            summary = summary.replace("내용:", "").trim();
        }

        AssembleAddRequest assembleAddRequest = AssembleAddRequest.builder()
                .users(usersService.findByEmail(email))
                .title(title)
                .content(summary)
                .category("assemble")
                .createAt(LocalDateTime.now())
                .build();
        AssembleSummaryResponse assembleSummaryResponse =  assembleBoardService.save(assembleAddRequest);
        return ResponseEntity.ok().body(assembleSummaryResponse);
    }
}
