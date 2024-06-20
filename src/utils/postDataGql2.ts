import type { GqlOps } from '#gql';

export default async (consulta: any, params: any, loading = true) => {
  try {
    if (loading) showLoading();
    const GqlInstance = useGql();
    const result = await GqlInstance(consulta as GqlOps, params);
    if (loading) hideLoading();
    return extraer(result);
  } catch (error) {
    console.log('Error API Gql:', error);
    ApiError(
      'Hubo un error, intenta de nuevo o cantactese con el administrador',
    );
  }
};
