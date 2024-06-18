// FILTRADOR DE DATA EN INPUTS
export const filterEmpleados = (
  val: any,
  update: any,
  dataOpcion: any,
  data: any,
) => {
  update(() => {
    const needle = val.toLowerCase();
    // console.log(needle);
    dataOpcion = data.filter((item: any) =>
      item.nombre.toLowerCase().includes(needle),
    );
  });
};
