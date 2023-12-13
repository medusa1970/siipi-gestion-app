import { Notify, Loading } from 'quasar';

/**LOADING */
const showLoading = () => Loading.show();
const hideLoading = () => Loading.hide();

/**NOTIFY */
const NotifySucess = (message: string) =>
  Notify.create({ message, color: 'positive', icon: 'check' });
const NotifyError = (message: string) =>
  Notify.create({ message, color: 'negative', icon: 'report_problem' });
const NotifyWarning = (message: string) =>
  Notify.create({
    message,
    color: 'orange',
    icon: 'warning',
    position: 'center',
    progress: true,
    timeout: 1500
  });
const NotifySucessCenter = (message: string) =>
  Notify.create({
    message,
    color: 'positive',
    icon: 'check',
    position: 'center',
    progress: true,
    timeout: 1500
  });

/**API ERROR */
const ApiError = (error: any) => {
  console.log(error);
  hideLoading();
  error.gqlErrors[0].message
    ? NotifyError(error.gqlErrors[0].message)
    : NotifyError('Error inesperado. Por favor, inténtelo de nuevo.');
};

export {
  showLoading,
  hideLoading,
  NotifySucess,
  NotifyError,
  ApiError,
  NotifyWarning,
  NotifySucessCenter
};
