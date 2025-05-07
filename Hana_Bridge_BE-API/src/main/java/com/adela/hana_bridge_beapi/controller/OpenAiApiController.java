package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import com.adela.hana_bridge_beapi.dto.openai.ClientResponse;
import com.adela.hana_bridge_beapi.service.AssembleBoardService;
import com.adela.hana_bridge_beapi.service.OpenAiService;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class OpenAiApiController {

    private final OpenAiService openAiService;
    private final TokenService tokenService;
    private final UsersService usersService;
    private final AssembleBoardService assembleBoardService;

    @PostMapping("/answer")
    public ResponseEntity<ClientResponse> askQuestion(@RequestBody ClientRequest clientRequest){
        String answer = openAiService.askChatGPT(clientRequest);
        return ResponseEntity.ok().body(new ClientResponse(answer));
    }

    @PostMapping("/summary")
    public ResponseEntity<AssembleAddRequest> askQuestionSummary(@RequestHeader("Authorization") String authHeader, @RequestBody ClientRequest clientRequest){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        //질문과 답변들을 이용하여 요약본 생성
        String summary = openAiService.summaryChatGPT(clientRequest);
        //요약본을 바탕으로 제목 생성
        String title = openAiService.titleChatGPT(summary);

        //양끝에 ""문자 없애기
        if (title.startsWith("\"") && title.endsWith("\"")) {
            title = title.substring(1, title.length() - 1);
        }

        AssembleAddRequest assembleAddRequest = AssembleAddRequest.builder()
                .users(usersService.findByEmail(email))
                .title(title)
                .content(summary)
                .category("assemble")
                .createdAt(LocalDateTime.now())
                .build();
        assembleBoardService.save(assembleAddRequest);
        return ResponseEntity.ok().body(assembleAddRequest);
    }
}
