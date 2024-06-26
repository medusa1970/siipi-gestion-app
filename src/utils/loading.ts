import { Loading } from 'quasar';

export const loading = function (code: () => any): any {
  let res;
  Loading.show();
  try {
    res = code();
  } catch (e) {
    throw e;
  } finally {
    Loading.hide();
  }
  return res;
};

export const loadingAsync = async function (code: () => any): Promise<any> {
  let res;
  Loading.show();
  try {
    res = await code();
  } catch (e) {
    throw e;
  } finally {
    Loading.hide();
  }
  return res;
};
