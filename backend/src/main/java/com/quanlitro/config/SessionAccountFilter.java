package com.quanlitro.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

/** Rejects a stored session when its account was locked, deleted or changed. */
public class SessionAccountFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService users;
    private final AuthenticationEntryPoint entryPoint;

    public SessionAccountFilter(CustomUserDetailsService users, AuthenticationEntryPoint entryPoint) {
        this.users = users;
        this.entryPoint = entryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal sessionUser) {
            UserPrincipal current = null;
            try {
                current = (UserPrincipal) users.loadUserByUsername(sessionUser.getUsername());
            } catch (UsernameNotFoundException ignored) {
                // Deleted accounts have no valid session.
            }
            if (current == null || !current.isAccountNonLocked()
                    || !Objects.equals(sessionUser.getId(), current.getId())
                    || !Objects.equals(sessionUser.getPassword(), current.getPassword())
                    || !Objects.equals(sessionUser.getAuthorities(), current.getAuthorities())
                    || !Objects.equals(sessionUser.getKhachThueId(), current.getKhachThueId())) {
                HttpSession session = request.getSession(false);
                if (session != null) session.invalidate();
                SecurityContextHolder.clearContext();
                entryPoint.commence(request, response, new CredentialsExpiredException("Session invalidated"));
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
