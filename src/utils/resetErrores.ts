export default function (...errs: any[]) {
  for (const err of errs) {
    err.value = null;
  }
}
