package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Category;
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
    private String categoryName;
    private String content;
    private LocalDateTime createAt;

    public void connectionUserEntity(Users users){
        this.users = users;
    }

    public AssembleBoard toEntity(Category categorys){
        return AssembleBoard.builder()
                .users(users)
                .title(title)
                .category(category)
                .categorys(categorys)
                .content(content)
                .createAt(createAt)
                .build();
    }
}
