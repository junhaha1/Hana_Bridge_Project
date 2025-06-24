package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

@Immutable
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "category")
public class Category {
    @Id
    private int id;
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;
}
