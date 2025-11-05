package org.uv.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uv.demo.entity.OtpCode;
import java.util.Optional;

/**
 *
 * @author pedro
 */
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findByUserEmailAndCode(String email, String code);
}
