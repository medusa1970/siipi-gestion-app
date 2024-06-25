import { Notify, Loading } from 'quasar';

/**LOADING */
export const showLoading = () => Loading.show();
export const hideLoading = () => Loading.hide();

/**NOTIFY */
export const NotifySucess = (message: string) =>
  Notify.create({ message, color: 'positive', icon: 'check' });

export const NotifyError = (message: string) =>
  Notify.create({ message, color: 'negative', icon: 'report_problem' });

export const NotifyWarning = (message: string) =>
  Notify.create({
    message,
    color: 'orange',
    icon: 'warning',
    position: 'center',
    progress: true,
    timeout: 1500,
  });

export const NotifySucessCenter = (message: string) =>
  Notify.create({
    message,
    color: 'positive',
    icon: 'check',
    position: 'center',
    progress: true,
    timeout: 1000,
  });

/**API ERROR */
export const ApiError = (error: any) => {
  hideLoading();
  console.log(error);
  error.gqlErrors?.[0]?.message
    ? NotifyError(error.gqlErrors?.[0]?.message)
    : NotifyError('Error inesperado. Por favor, inténtelo de nuevo.');
};

/**
 * Get error code
 */
export const getApiErrorCode = (err: any): string => {
  const apiError = err.gqlErrors?.[0]?.message ?? null;
  console.log(apiError);
  if (apiError) {
    const regex = /\[\[(.*)\]\]/;
    const match = apiError.match(regex);
    if (match?.[1]) {
      return 'B' + match?.[1];
    } else {
      console.warn(err);
      return 'B_ERROR_API';
    }
  } else {
    console.warn(err);
    return 'B_ERROR';
  }
};
