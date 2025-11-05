import React, { useState } from "react";
import Login from "./Login";
import Registro from "./Registro";
import OTPVerificacion from "./OTPVerificacion";

export default function App() {
  const [screen, setScreen] = useState("login");

  return (
    <>
      {screen === "login" && (
        <Login
          onSwitchToRegister={() => setScreen("registro")}
          onForgotPassword={() => setScreen("otp")}
        />
      )}

      {screen === "registro" && (
        <Registro onSwitchToLogin={() => setScreen("login")} />
      )}

      {screen === "otp" && (
        <OTPVerificacion
          onVerifySuccess={(data) => {
            alert("Código verificado correctamente:\n" + JSON.stringify(data));
            setScreen("login");
          }}
          onResend={() => alert("Se reenviará un nuevo código")}
        />
      )}
    </>
  );
}