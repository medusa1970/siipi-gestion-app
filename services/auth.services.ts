import {
  showLoading,
  hideLoading,
  NotifyError,
  NotifySucess
} from '@/helpers/message.service';

/**MESSAGE ERROR API */
const ApiError = (error: any) => {
  console.log(error);
  hideLoading();
  // if (error.response.data.message)
  //   return NotifyError(error.response.data.message);
  NotifyError('Error inesperado. Por favor, inténtelo de nuevo.');
};

export const graph = async (query: any, message: string) => {
  try {
    showLoading();
    const res = await query;
    hideLoading();
    NotifySucess(message);
    return res;
  } catch (error) {
    ApiError(error);
  }
};

// const authService = {
//   login: (data: {usuario: string, contrasena: string}) => postData()
// };
// export { authService };
