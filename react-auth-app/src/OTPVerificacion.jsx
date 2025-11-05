import React, { useState, useRef } from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 600,
    width: "90%",
    margin: "50px auto",
    padding: 30,
    backgroundColor: "rgba(255, 250, 223, 0.95)",
    border: "1px solid #e1d8b9",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    color: "#4a4a4a",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  iconWrapper: { display: "flex", justifyContent: "center", marginBottom: 20 },
  icon: { width: 100, height: 100, objectFit: "contain" },
  title: {
    textAlign: "center",
    marginBottom: 25,
    color: "#7a6600",
    fontSize: 28,
    fontWeight: 700,
  },
  label: { alignSelf: "stretch", marginBottom: 8, fontWeight: 600 },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
    border: "1.5px solid #d1c48f",
    fontSize: 16,
    backgroundColor: "#fffef7",
  },
  inputGroup: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 30 },
  inputBox: {
    width: 50,
    height: 55,
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    borderRadius: 6,
    border: "1.5px solid #d1c48f",
    backgroundColor: "#fffef7",
  },
  button: {
    width: "100%",
    padding: 14,
    backgroundColor: "#e0b542",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default function OTPVerificacion({ onVerifySuccess }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChangeOtp = (value, index) => {
    const newOtp = [...otp];
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    if (cleanValue && index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setMessage("Ingresa un correo válido antes de solicitar el código.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Código OTP enviado a tu correo.");
      } else if (response.status === 404) {
        setMessage("El correo no está registrado en la base de datos.");
      } else {
        setMessage("No se pudo enviar el código OTP. Intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setMessage("Ingresa los 6 dígitos del código OTP.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Bienvenido ${data.fullName} (${data.email})`);
        if (onVerifySuccess) onVerifySuccess(data);
      } else if (response.status === 400) {
        setMessage("Código OTP incorrecto o expirado.");
      } else if (response.status === 404) {
        setMessage("El correo no está registrado.");
      } else {
        setMessage("Error al verificar el código. Intenta de nuevo.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <div style={styles.iconWrapper}>
        <img src="/assets/icon.png" alt="Icono" style={styles.icon} />
      </div>

      <h2 style={styles.title}>Verificación OTP</h2>

      <label style={styles.label}>
        Correo Electrónico:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          style={styles.input}
          required
        />
      </label>

      <button
        type="button"
        onClick={handleSendOtp}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar código OTP"}
      </button>

      <p style={{ textAlign: "center", margin: "20px 0 10px" }}>
        Ingresa el código de 6 dígitos que recibiste:
      </p>

      <div style={styles.inputGroup}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleChangeOtp(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputs.current[index] = el)}
            style={styles.inputBox}
            maxLength={1}
          />
        ))}
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Verificando..." : "Verificar código"}
      </button>

      {message && (
        <p style={{ textAlign: "center", marginTop: 15, color: "#7a6600" }}>
          {message}
        </p>
      )}
    </form>
  );
}