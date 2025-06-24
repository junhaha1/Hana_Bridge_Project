package com.adela.hana_bridge_beapi.dto.assemble;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UserCategoryResponse {
    private List<String> categoryList;
}
