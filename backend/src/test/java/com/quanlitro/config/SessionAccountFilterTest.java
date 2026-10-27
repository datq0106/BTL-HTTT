package com.quanlitro.config;

import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.VaiTro;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SessionAccountFilterTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void activeUnchangedAccountCanContinue() throws Exception {
        UserPrincipal original = principal("hoat_dong", "hash-a", "ROLE_KHACH");
        UserPrincipal current = principal("hoat_dong", "hash-a", "ROLE_KHACH");
        CustomUserDetailsService users = mock(CustomUserDetailsService.class);
        when(users.loadUserByUsername("resident")).thenReturn(current);
        AuthenticationEntryPoint entryPoint = mock(AuthenticationEntryPoint.class);
        MockFilterChain chain = new MockFilterChain();
        authenticate(original);

        new SessionAccountFilter(users, entryPoint).doFilter(
                new MockHttpServletRequest(), new MockHttpServletResponse(), chain);

        assertNotNull(chain.getRequest());
    }

    @Test
    void lockedAccountLosesExistingSession() throws Exception {
        assertRevoked(principal("hoat_dong", "hash-a", "ROLE_KHACH"),
                principal("khoa", "hash-a", "ROLE_KHACH"));
    }

    @Test
    void passwordChangeLosesExistingSession() throws Exception {
        assertRevoked(principal("hoat_dong", "hash-a", "ROLE_KHACH"),
                principal("hoat_dong", "hash-b", "ROLE_KHACH"));
    }

    @Test
    void roleChangeLosesExistingSession() throws Exception {
        assertRevoked(principal("hoat_dong", "hash-a", "ROLE_ADMIN"),
                principal("hoat_dong", "hash-a", "ROLE_QUAN_LY"));
    }

    private void assertRevoked(UserPrincipal original, UserPrincipal current) throws Exception {
        CustomUserDetailsService users = mock(CustomUserDetailsService.class);
        when(users.loadUserByUsername("resident")).thenReturn(current);
        AuthenticationEntryPoint entryPoint = mock(AuthenticationEntryPoint.class);
        doAnswer(invocation -> {
            ((MockHttpServletResponse) invocation.getArgument(1)).setStatus(401);
            return null;
        }).when(entryPoint).commence(any(), any(), any());
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = new MockHttpSession();
        request.setSession(session);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();
        authenticate(original);

        new SessionAccountFilter(users, entryPoint).doFilter(request, response, chain);

        assertEquals(401, response.getStatus());
        assertTrue(session.isInvalid());
        assertNull(chain.getRequest());
        verify(entryPoint).commence(any(), any(), any());
    }

    private static void authenticate(UserPrincipal principal) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities()));
    }

    private static UserPrincipal principal(String status, String hash, String role) {
        VaiTro vaiTro = new VaiTro();
        vaiTro.setMaVaiTro(role);
        TaiKhoan account = new TaiKhoan();
        account.setId(7);
        account.setTenDangNhap("resident");
        account.setMatKhauHash(hash);
        account.setHoTen("Test Resident");
        account.setTrangThai(status);
        account.setVaiTro(vaiTro);
        return UserPrincipal.from(account);
    }
}
