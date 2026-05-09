package com.example.drishti.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

/**
 * Maps Supabase JWT claims to Spring Security authorities.
 * Reads role from user_metadata.role or app_metadata.role and emits ROLE_<value>.
 */
public class SupabaseJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        String role = extractRole(jwt.getClaim("user_metadata"));
        if (role == null) {
            role = extractRole(jwt.getClaim("app_metadata"));
        }
        if (role != null && !role.isBlank()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        }
        return authorities;
    }

    @SuppressWarnings("unchecked")
    private String extractRole(Object claim) {
        if (claim instanceof Map<?, ?> map) {
            Object role = ((Map<String, Object>) map).get("role");
            return role != null ? role.toString() : null;
        }
        return null;
    }
}