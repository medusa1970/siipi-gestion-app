import localforage from "localforage";

// Configurar LocalForage con manejo de errores
export const iniciarLocalForage = async () => {
  try {
    localforage.config({
      name: "siipi",
      storeName: "dataStore", // Nombre del almacenamiento (opcional)
      driver: localforage.INDEXEDDB, // Asegúrate de usar IndexedDB
    });
  } catch (err) {
    console.error("Error al configurar LocalForage:", err);
  }
};
