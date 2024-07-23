// const { $socket } = useNuxtApp();
// console.log($socket);
// import { storeOferta } from '@/modulos/ofertas/ofertas.store';
// import { storeAlmacen } from '@/modulos/almacen/almacen.store';

// export const socketsOn = (sockets) => async () => {
//   console.log('Sockets on: ', sockets);
//   for (const socket of sockets) {
//     switch (socket) {
//       case 'cambiosProductos':
//         $socket.on('cambiosProductos', async (data: any) => {
//           console.log('Sockets triggered: ', socket);
//           await storeAlmacen().actualizarIndexDB();
//         });
//         break;
//       case 'cambiosOfertas':
//         $socket.on('cambiosOfertas', async (data: any) => {
//           console.log('Sockets triggered: ', socket);
//           await storeOferta().actualizarIndexDB();
//         });
//         break;
//     }
//   }
// };

// export const socketsOff = (sockets) => async () => {
//   console.log('Sockets off: ', sockets);
//   for (const socket of sockets) {
//     switch (socket) {
//       case 'cambiosProductos':
//         $socket.off('cambiosProductos');
//         break;
//       case 'cambiosOfertas':
//         $socket.off('cambiosOfertas');
//         break;
//     }
//   }
// };
