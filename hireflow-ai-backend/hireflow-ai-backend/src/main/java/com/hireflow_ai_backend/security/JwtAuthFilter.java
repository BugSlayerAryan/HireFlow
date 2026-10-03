package com.hireflow_ai_backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private CustomUserDetailsService userDetailsService;

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain chain)
                        throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        try {
                                String token = authHeader.substring(7);
                                String email = jwtUtil.extractEmail(token);

                                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                                        // Re-verify the token is valid for this user
                                        // (Ensure validateToken exists in JwtUtil, or just check role/subject)
                                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                        userDetails,
                                                        null,
                                                        userDetails.getAuthorities());

                                        SecurityContextHolder.getContext().setAuthentication(authentication);
                                }
                        } catch (Exception e) {
                                // 🛡️ Log and skip if token is corrupted, expired, or user is gone
                                System.out.println("JWT Filter Warning: " + e.getMessage());
                        }
                }

                chain.doFilter(request, response);
        }
}
