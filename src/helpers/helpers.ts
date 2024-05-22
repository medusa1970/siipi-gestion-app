// CONVERTIDOR FILE a BASE64
export const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// FILTRADOR DE DATA EN INPUTS
export const filterEmpleados = (
  val: any,
  update: any,
  dataOpcion: any,
  data: any,
) => {
  update(() => {
    const needle = val.toLowerCase();
    console.log(needle);
    dataOpcion = data.filter((item: any) =>
      item.nombre.toLowerCase().includes(needle),
    );
  });
};
