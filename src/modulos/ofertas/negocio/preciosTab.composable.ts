export const usePrecioTab = () => {
  const estado = reactive({
    datos_preciosOferta: {
      precioSinFactura: null as number,
      precioConFactura: null as number,
      precios: [] as any[],
    },
  });

  return { estado };
};
