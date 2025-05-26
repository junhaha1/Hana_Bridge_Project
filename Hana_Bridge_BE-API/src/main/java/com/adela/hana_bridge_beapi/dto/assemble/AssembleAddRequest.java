package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class AssembleAddRequest {
    private Users users;
    private String title;
    private String category;
    private String content;
    private LocalDateTime createAt;

    public AssembleBoard toEntity(){
        return AssembleBoard.builder()
                .users(users)
                .title(title)
                .category(category)
                .content(content)
                .createAt(createAt)
                .build();
    }
}
