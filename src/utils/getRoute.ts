import { useRouter } from 'vue-router';
export default function (routeName: string) {
  const route = useRouter()
    .getRoutes()
    .find((route) => route.name === routeName);
  if (route) {
    return route.path;
  } else {
    // TODO avisar
  }
}
