import React, { useState } from "react";

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
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    color: "#7a6600",
    fontSize: 28,
    fontWeight: 700,
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  label: {
    alignSelf: "stretch",
    display: "block",
    marginBottom: 8,
    color: "#555",
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 4,
    marginBottom: 20,
    borderRadius: 6,
    border: "1.5px solid #d1c48f",
    fontSize: 16,
    backgroundColor: "#fffef7",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#e0b542",
    outline: "none",
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
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#c79a32",
  },
  switchPanel: {
    marginTop: 20,
    color: "#7a6600",
    cursor: "pointer",
    fontWeight: 600,
    textDecoration: "underline",
    background: "none",
    border: "none",
    fontSize: 16,
  },
  successMsg: {
    marginTop: 20,
    backgroundColor: "#eafbe4",
    color: "#3a7a00",
    padding: 15,
    borderRadius: 6,
    textAlign: "center",
    fontWeight: 600,
    width: "100%",
    border: "1px solid #bde5a8",
  },
};

export default function Login({ onSwitchToRegister, onForgotPassword }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [hoverLogin, setHoverLogin] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.email && formData.password) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const data = await response.json();
      setUserData({
        fullName: data.fullName,
        email: data.email,
      });

        setFormData({ email: "", password: "" });
        } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
      }
    } else {
      alert("Por favor, llena todos los campos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <div style={styles.iconWrapper}>
        <img src="/assets/icon.png" alt="Icono" style={styles.icon} />
      </div>

      <h2 style={styles.title}>Iniciar Sesión</h2>

      <label style={styles.label} htmlFor="email">
        Email:
        <input
          id="email"
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Tu correo"
          style={{
            ...styles.input,
            ...(focusedField === "email" ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />
      </label>

      <label style={styles.label} htmlFor="password">
        Contraseña:
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="******"
          style={{
            ...styles.input,
            ...(focusedField === "password" ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
        />
      </label>

      <button
        type="submit"
        style={hoverLogin ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setHoverLogin(true)}
        onMouseLeave={() => setHoverLogin(false)}
      >
        Entrar
      </button>

      {userData && (
        <div style={styles.successMsg}>
          Bienvenido, <strong>{userData.fullName}</strong> <br />
          Has iniciado sesión con <em>{userData.email}</em>.
        </div>
      )}

      <button type="button" style={styles.switchPanel} onClick={onSwitchToRegister}>
        Regístrate aquí
      </button>

      <button type="button" style={styles.switchPanel} onClick={onForgotPassword}>
        ¿Olvidaste tu contraseña?
      </button>
    </form>
  );
}