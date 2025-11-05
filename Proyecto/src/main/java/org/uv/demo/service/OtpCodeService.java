package org.uv.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.uv.demo.entity.OtpCode;
import org.uv.demo.entity.User;
import org.uv.demo.repository.OtpCodeRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 *
 * @author pedro
 */
@Service
public class OtpCodeService {

    @Autowired
    private OtpCodeRepository otpCodeRepository;

    public OtpCode generateOtp(User user, String device) {
        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime now = LocalDateTime.now();

        OtpCode otp = new OtpCode();
        otp.setUser(user);
        otp.setCode(code);
        otp.setDevice(device);
        otp.setCreationDate(now);
        otp.setExpirationDate(now.plusMinutes(5));
        otp.setUsed(false);

        return otpCodeRepository.save(otp);
    }

    public boolean validateOtp(String email, String code) {
        Optional<OtpCode> optionalOtp = otpCodeRepository.findByUserEmailAndCode(email, code);
        if (optionalOtp.isEmpty()) {
            return false;
        }
        OtpCode otp = optionalOtp.get();
        if (otp.isUsed()) {
            return false;
        }
        LocalDateTime ahora = LocalDateTime.now();
        if (otp.getExpirationDate().isBefore(ahora)) {
            return false;
        }
        otp.setUsed(true);
        otpCodeRepository.save(otp);
        return true;
    }

}
