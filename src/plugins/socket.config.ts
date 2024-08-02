import { io, Socket } from 'socket.io-client';

// Extiende temporalmente la interfaz NuxtApp para este archivo
declare module '#app' {
  interface NuxtApp {
    $socket: Socket;
  }
}
const debug = false;

export default defineNuxtPlugin((nuxtApp) => {
  const socketUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://api.gestion.sii-pi.com';
  const socket = io(socketUrl, {});

  // Manejador para el evento de conexión exitosa
  socket.on('connect', () => {
    if (debug) console.log('Conectado a sockets exitosamente');
  });

  // Manejador para el evento de error de conexión
  socket.on('connect_error', (error) => {
    if (debug) console.log('Fallo al conectarse a sockets:', error);
  });

  // Agregar un manejador para otros eventos podría ser útil para la depuración
  socket.on('disconnect', (reason) => {
    if (debug) console.log('Desconectado del socket:', reason);
  });

  if (debug) console.log('providing socket', socketUrl, socket);
  nuxtApp.provide('socket', socket);
});
