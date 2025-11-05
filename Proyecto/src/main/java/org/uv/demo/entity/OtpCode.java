package org.uv.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 *
 * @author pedro
 */
@Entity
@Table(name = "otp_code")
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Column(nullable = false)
    private boolean used;

    @Column(nullable = false, length = 100)
    private String device;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id_user")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    public OtpCode() {
    }

    public OtpCode(Long otpId, String code, LocalDateTime creationDate, LocalDateTime expirationDate, boolean used, String device, User user) {
        this.otpId = otpId;
        this.code = code;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
        this.used = used;
        this.device = device;
        this.user = user;
    }

    // Getters y Setters
    public Long getOtpId() {
        return otpId;
    }

    public void setOtpId(Long otpId) {
        this.otpId = otpId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
