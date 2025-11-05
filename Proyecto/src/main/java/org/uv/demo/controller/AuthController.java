package org.uv.demo.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uv.demo.entity.User;
import org.uv.demo.service.UserService;
import org.uv.demo.service.OtpCodeService;
import org.uv.demo.service.MailService;

/**
 *
 * @author pedro
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private OtpCodeService otpService;
    @Autowired
    private MailService mailService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User userData) {
        User user = userService.findByEmail(userData.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        boolean valid = userService.validatePassword(user, userData.getPassword());
        if (!valid) {
            return ResponseEntity.badRequest().body("Contraseña incorrecta");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("fullName", user.getName() + " " + user.getLastname());
        response.put("email", user.getEmail());
        response.put("message", "Inicio de sesión exitoso");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("El correo electrónico es obligatorio.");
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado con el correo: " + email);
        }

        var otp = otpService.generateOtp(user, "web");
        mailService.sendOtpEmail(email, otp.getCode());
        return ResponseEntity.ok("OTP generado y enviado correctamente a " + email);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("Faltan datos en la solicitud.");
        }
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado con el correo: " + email);
        }
        boolean isValid = otpService.validateOtp(email, code);
        if (!isValid) {
            return ResponseEntity.badRequest().body("Código OTP inválido o expirado.");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verificación exitosa");
        response.put("fullName", user.getName() + " " + user.getLastname());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            return ResponseEntity.badRequest().body("El correo ya está registrado.");
        }
        return ResponseEntity.ok("Disponible");
    }
}
