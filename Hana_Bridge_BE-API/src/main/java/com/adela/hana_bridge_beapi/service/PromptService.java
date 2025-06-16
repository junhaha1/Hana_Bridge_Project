package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.prompt.PromptRequest;
import com.adela.hana_bridge_beapi.dto.prompt.PromptResponse;
import com.adela.hana_bridge_beapi.dto.prompt.PromptUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Prompt;
import com.adela.hana_bridge_beapi.repository.PromptRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromptService {
    private final PromptRepository promptRepository;

    @Transactional
    public void addPrompt(PromptRequest promptRequest) {
        promptRepository.save(promptRequest.toEntity());
    }

    public List<Prompt> getPromptsForUser(Long userId) {
        return promptRepository.findByUsersId(userId);
    }
    @Transactional
    public PromptResponse updatePrompt(PromptUpdateRequest request) {
        Prompt prompt = promptRepository.findById(request.getPromptId())
                .orElseThrow(() -> new EntityNotFoundException("해당 프롬프트가 존재하지 않습니다."));

        prompt.updatePrompt(request.getName(), request.getRole(),
                request.getForm(), request.getLevel(), request.getOption());

        return PromptResponse.builder()
                .promptId(prompt.getPromptId())
                .role(prompt.getRole())
                .form(prompt.getRole())
                .level(prompt.getLevel())
                .option(prompt.getOption())
                .build();
    }

    public void deletePrompt(Long promptId) {
        promptRepository.deleteById(promptId);
    }
}
