import { showLoading, hideLoading, ApiError } from '@/helpers/message.service';

const postData = async (gql: any) => {
  try {
    showLoading();
    const data = await gql;
    hideLoading();
    // NotifySucess(message || 'Operación realizada con éxito');
    return data;
  } catch (error) {
    ApiError(error);
    //   LOGICA PARA MANEJAR ERRORES
  }
};

export { postData };
