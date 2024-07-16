import { io, Socket } from 'socket.io-client';

// Extiende temporalmente la interfaz NuxtApp para este archivo
declare module '#app' {
  interface NuxtApp {
    $socket: Socket;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // const socketUrl = 'siipi-gestion-production-f6a0.up.railway.app';
  const socketUrl = 'http://localhost:3000';
  // const socketOptions = {};

  const socket = io(socketUrl);

  // Manejador para el evento de conexión exitosa
  socket.on('connect', () => {
    console.log('Conectado a sockets exitosamente');
  });

  // Manejador para el evento de error de conexión
  socket.on('connect_error', (error) => {
    console.log('Fallo al conectarse a sockets:', error);
  });

  // Agregar un manejador para otros eventos podría ser útil para la depuración
  socket.on('disconnect', (reason) => {
    console.log('Desconectado del socket:', reason);
  });

  nuxtApp.provide('socket', socket);
});
