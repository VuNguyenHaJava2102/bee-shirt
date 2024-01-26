package com.datn.backend.model.khach_hang;

import com.datn.backend.model.Account;
import com.datn.backend.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "khach_hang")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class KhachHang extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String hoTen;
    private LocalDate ngaySinh;
    private String sdt;
    private String email;
    private boolean gioiTinh;
    private String imageUrl;
    private int trangThai;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id")
    private Account account;
}
