export const inputConfig = {
  labelAdentro: false,
  outlined: true,
  filled: false,
  dense: true,
  clase: "",
  color: "black",
  bgColorLleno: "blue-grey-1",
  bgColorVacio: "grey-1",
};

export const locale = {
  /* starting with Sunday */
  days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_",
    ),
  monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: "dias",
};

export async function UrlToBase64Image(url, callback) {
  // downloading image
  let response;
  try {
    response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
  } catch (e) {
    console.error("Failed to fetch or convert image:", e);
    return null;
  }

  // reading data
  const blob = await response.blob();
  const lector = new FileReader();
  lector.addEventListener("load", () => {
    callback(lector.result);
  });
  lector.readAsDataURL(blob);
}

// convertir coleccion a select
export const toSelect = (coleccion: Array<any>) =>
  Array.isArray(coleccion)
    ? coleccion.map((marca) => {
        return {
          label: marca.nombre,
          value: marca._id,
          disable: false,
        };
      })
    : [];
