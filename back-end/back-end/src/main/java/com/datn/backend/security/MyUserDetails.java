package com.datn.backend.security;

import com.datn.backend.model.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

public class MyUserDetails implements UserDetails {

    private Account account;

    public MyUserDetails(Account account) {
        this.account = account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(account.getAuthorities())
                .stream()
                .map(au -> new SimpleGrantedAuthority(au))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return account.getMatKhau();
    }

    @Override
    public String getUsername() {
        return account.getTenDangNhap();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return account.isTrangThai();
    }
}
