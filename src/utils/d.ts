export const d = (REACT, v, t = null) =>
  REACT.value.push(
    (t ? t + ' = ' : '') +
      (v === undefined
        ? '[undefined]'
        : v === null
        ? '[null]'
        : v === ''
        ? '[empty string]'
        : v),
  );
