// debe coincidir con entidades.definicion lado backend
export const definicionRoles = {
  visitante: ['ACCEDER'],
  administrador: ['ACCEDER', 'ADMINISTRAR', 'HACER_INVENTARIO'],
  responsable: ['ACCEDER', 'HACER_INVENTARIO', 'HACER_PEDIDO'],
};
