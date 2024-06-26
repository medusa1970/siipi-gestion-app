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
  const socket = io('http://localhost:3000');

  nuxtApp.provide('socket', socket);
});
