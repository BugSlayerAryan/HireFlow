package com.hireflow_ai_backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

	@Bean
	public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowCredentials(true);
		config.setAllowedOrigins(List.of(
				"http://localhost:3000",
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:5175",
				"http://localhost:5176",
				"http://localhost:5177",
				"http://localhost:5178",
				"http://localhost:5179",
				"http://127.0.0.1:5173",
				"http://127.0.0.1:5174",
				"http://127.0.0.1:5175",
				"http://127.0.0.1:5176",
				"http://127.0.0.1:5177",
				"http://127.0.0.1:5178",
				"http://127.0.0.1:5179"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setExposedHeaders(List.of("Authorization"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return source;
	}
}
