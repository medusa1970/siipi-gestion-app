import { Notify } from 'quasar';

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

/**
 * Get error code
 */
export const getApiErrorCode = (err: any): string => {
  const apiError = err.gqlErrors?.[0]?.message ?? null;
  console.log(apiError);
  if (apiError) {
    const regex = /\[\[(.*)\]\]/;
    const match = apiError.match(regex);
    const codigo = match?.[1];
    if (codigo) {
      if (codigo === '204') {
        const regex2 = /<(.*)>/;
        const match = apiError.match(regex2);
        return 'B' + codigo + ',' + match?.[1];
      }
      return 'B' + codigo;
    } else {
      console.warn(err);
      return 'B_ERROR_API';
    }
  } else {
    console.warn(err);
    return 'B_ERROR';
  }
};
