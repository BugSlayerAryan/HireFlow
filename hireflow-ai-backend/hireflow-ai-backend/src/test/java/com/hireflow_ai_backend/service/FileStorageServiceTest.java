package com.hireflow_ai_backend.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

class FileStorageServiceTest {
    @Test
    void storesImageInsideRequestedFolder() throws Exception {
        Path temp = Files.createTempDirectory("hireflow-upload-test");
        FileStorageService service = new FileStorageService(temp.toString());
        MockMultipartFile image = new MockMultipartFile("image", "avatar.png", "image/png", new byte[] {1, 2, 3});

        String url = service.storeImage(image, "profiles");

        assertTrue(url.startsWith("/uploads/profiles/"));
        assertTrue(Files.list(temp.resolve("profiles")).findAny().isPresent());
    }

    @Test
    void rejectsNonImageUpload() throws Exception {
        Path temp = Files.createTempDirectory("hireflow-upload-test");
        FileStorageService service = new FileStorageService(temp.toString());
        MockMultipartFile file = new MockMultipartFile("image", "notes.txt", "text/plain", "hello".getBytes());

        assertThrows(ResponseStatusException.class, () -> service.storeImage(file, "profiles"));
    }
}
