package com.voicevoting.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class BallotEncryptionService {
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int NONCE_LENGTH_BYTES = 12;
    private static final int TAG_LENGTH_BITS = 128;

    private final SecureRandom secureRandom = new SecureRandom();
    private final byte[] encryptionKey;

    public BallotEncryptionService(@Value("${vote.encryption.key:}") String encodedKey) {
        if (encodedKey.isBlank()) {
            throw new IllegalStateException("VOTE_ENCRYPTION_KEY must be configured.");
        }
        encryptionKey = Base64.getDecoder().decode(encodedKey);
        if (encryptionKey.length != 32) {
            throw new IllegalStateException("VOTE_ENCRYPTION_KEY must be a Base64-encoded 32-byte key.");
        }
    }

    public EncryptedBallot encrypt(String candidateId, String electionId) {
        try {
            byte[] nonce = new byte[NONCE_LENGTH_BYTES];
            secureRandom.nextBytes(nonce);
            Cipher cipher = newCipher(Cipher.ENCRYPT_MODE, nonce, electionId);
            byte[] ciphertext = cipher.doFinal(candidateId.getBytes(StandardCharsets.UTF_8));
            return new EncryptedBallot(
                    Base64.getEncoder().encodeToString(ciphertext),
                    Base64.getEncoder().encodeToString(nonce));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to encrypt ballot.", exception);
        }
    }

    public String decrypt(String ciphertext, String encodedNonce, String electionId) {
        try {
            Cipher cipher = newCipher(Cipher.DECRYPT_MODE, Base64.getDecoder().decode(encodedNonce), electionId);
            byte[] plaintext = cipher.doFinal(Base64.getDecoder().decode(ciphertext));
            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (Exception exception) {
            throw new IllegalStateException("Encrypted ballot integrity check failed.", exception);
        }
    }

    private Cipher newCipher(int mode, byte[] nonce, String electionId) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(mode, new javax.crypto.spec.SecretKeySpec(encryptionKey, "AES"),
                new GCMParameterSpec(TAG_LENGTH_BITS, nonce));
        cipher.updateAAD(electionId.getBytes(StandardCharsets.UTF_8));
        return cipher;
    }

    public record EncryptedBallot(String ciphertext, String nonce) {
    }
}
