Descripción del proyecto

Este proyecto es un sistema de autenticación segura desarrollado con Spring Boot (backend) y React (frontend), que implementa un proceso de inicio de sesión con verificación OTP (One Time Password) enviada al correo electrónico del usuario.

El objetivo principal es reforzar la seguridad del acceso al sistema, evitando el uso de contraseñas fijas y utilizando códigos temporales de verificación.

El backend está construido con una arquitectura organizada por capas (controller, service, repository, entity), y emplea Spring Boot, JPA y MySQL para la persistencia de datos.
El frontend, hecho en React, gestiona la interfaz de usuario para enviar el correo electrónico, recibir el OTP y mostrar mensajes de validación o error.

- Backend (Spring Boot)

Clonar o descargar el proyecto.

Configurar el archivo application.properties con los datos de conexión a tu base de datos PostgreSQL
con tus especificaciones

Ejecutar la aplicación

El servidor se ejecutará por defecto en http://localhost:8080.

- Frontend (React)

Entrar a la carpeta del frontend.
Instalar dependencias:

npm install

Ejecutar el servidor de desarrollo:

npm start


La aplicación se abrirá automáticamente en http://localhost:3000.

Ejemplo de flujo de Login + OTP

Enviar el correo del usuario
El usuario escribe su correo electrónico en la pantalla de inicio de sesión.

El backend busca el usuario en la base de datos, genera un código OTP de 6 dígitos y lo envía al correo del usuario mediante el servicio de correo configurado.

Ingresar el código OTP

El usuario revisa su correo y copia el código recibido.
Luego lo introduce en el campo correspondiente en la pantalla de verificación.


El backend valida el código OTP con la base de datos.
Si el código es válido y no ha expirado, devuelve una respuesta.

Si el código no coincide o ya expiró, responde con un error 400 y un mensaje de advertencia.

Si la verificación fue exitosa, el usuario es redirigido al menú principal o dashboard con su nombre y correo visible.
