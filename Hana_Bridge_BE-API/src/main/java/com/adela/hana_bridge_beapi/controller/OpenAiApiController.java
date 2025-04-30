package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import com.adela.hana_bridge_beapi.dto.openai.ClientResponse;
import com.adela.hana_bridge_beapi.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class OpenAiApiController {

    private final OpenAiService openAiService;

    @PostMapping("/answer")
    public ResponseEntity<ClientResponse> askQuestion(@RequestBody ClientRequest clientRequest){
        String answer = openAiService.askChatGPT(clientRequest);
        return ResponseEntity.ok().body(new ClientResponse(answer));
    }
}
