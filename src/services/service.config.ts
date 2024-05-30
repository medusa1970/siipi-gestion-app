import { extraer } from '../helpers/leo';
import { ApiError, hideLoading, showLoading } from '../helpers/message.service';

const postDataGql = async (gql: any) => {
  try {
    showLoading();
    const data = await gql;
    hideLoading();
    // solo retorna el primer valor
    // ya que el resultado de la consulta siempre es
    // { [nombre_consulta]: data }
    return extraer(data);
  } catch (error) {
    console.log(error);
    ApiError(error);
  }
};

export { postDataGql };
