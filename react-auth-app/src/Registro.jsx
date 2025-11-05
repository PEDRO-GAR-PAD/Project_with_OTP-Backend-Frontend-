import React, { useState } from "react";

const styles = {
  container: {
    maxWidth: 600,
    margin: "50px auto",
    padding: 30,
    backgroundColor: "rgba(255, 250, 223, 0.95)",
    border: "1px solid #e1d8b9",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
  },
  label: {
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
    marginBottom: 16,
    borderRadius: 6,
    border: "1.5px solid #d1c48f",
    fontSize: 16,
    backgroundColor: "#fffef7",
    boxSizing: "border-box",
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
  buttonHover: { backgroundColor: "#c79a32" },
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
};

export default function Registro({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    passwordconfirm: "",
  });
  const [hoverRegister, setHoverRegister] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(formData.nombre) || !nameRegex.test(formData.apellidos)) {
    alert("El nombre y apellidos solo deben contener letras y espacios.");
    return;
  }

  if (!emailRegex.test(formData.email)) {
    alert("Ingresa un correo electrónico válido (ejemplo@dominio.com).");
    return;
  }

  if (formData.password !== formData.passwordconfirm) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const checkResponse = await fetch(
      `http://localhost:8080/api/auth/check-email?email=${encodeURIComponent(formData.email)}`
    );

    if (!checkResponse.ok) {
      const errorText = await checkResponse.text();
      alert(errorText || "El correo ya está registrado.");
      return;
    }
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.nombre,
        lastname: formData.apellidos,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.ok) {
      alert("Usuario registrado correctamente.");
      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        passwordconfirm: "",
      });
    } else {
      const errorText = await response.text();
      alert("Error al registrar: " + errorText);
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    alert("No se pudo conectar con el servidor.");
  }
};

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <div style={styles.iconWrapper}>
        <img src="/assets/icon.png" alt="Icono" style={styles.icon} />
      </div>

      <h2 style={styles.title}>Registro</h2>

      {[
        { id: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre" },
        { id: "apellidos", label: "Apellidos", type: "text", placeholder: "Tus apellidos" },
        { id: "email", label: "Email", type: "email", placeholder: "ejemplo@correo.com" },
      ].map((field) => (
        <label key={field.id} style={styles.label} htmlFor={field.id}>
          {field.label}:
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            value={formData[field.id]}
            onChange={handleChange}
            required
            placeholder={field.placeholder}
            style={{
              ...styles.input,
              ...(focusedField === field.id ? { borderColor: "#e0b542" } : {}),
            }}
            onFocus={() => setFocusedField(field.id)}
            onBlur={() => setFocusedField(null)}
          />
        </label>
      ))}

      <label style={styles.label} htmlFor="password">
        Contraseña:
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            ...(focusedField === "password" ? { borderColor: "#e0b542" } : {}),
          }}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
        />
      </label>

      <label style={styles.label} htmlFor="passwordconfirm">
        Confirmar Contraseña:
        <input
          id="passwordconfirm"
          name="passwordconfirm"
          type="password"
          value={formData.passwordconfirm}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            ...(focusedField === "passwordconfirm" ? { borderColor: "#e0b542" } : {}),
          }}
          onFocus={() => setFocusedField("passwordconfirm")}
          onBlur={() => setFocusedField(null)}
        />
      </label>

      <button
        type="submit"
        style={hoverRegister ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setHoverRegister(true)}
        onMouseLeave={() => setHoverRegister(false)}
      >
        Registrarse
      </button>

      <button type="button" style={styles.switchPanel} onClick={onSwitchToLogin}>
        ¿Ya tienes cuenta? Inicia sesión aquí
      </button>
    </form>
  );
}