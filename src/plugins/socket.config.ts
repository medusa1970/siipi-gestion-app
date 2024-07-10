import { io, Socket } from 'socket.io-client';
// http://localhost:3000/graphql
// console.log(process.env.GRAPH_URI);

// Extiende temporalmente la interfaz NuxtApp para este archivo
declare module '#app' {
  interface NuxtApp {
    $socket: Socket;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('https://siipi-gestion-production-f6a0.up.railway.app');

  nuxtApp.provide('socket', socket);
});
