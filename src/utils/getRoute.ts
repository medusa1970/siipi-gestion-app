export default function (router: any, routeName: string) {
  const route = router.getRoutes().find((r: any) => r.name === routeName);
  if (route) {
    return route.path;
  } else {
    console.warn(`Ruta desconocida (${routeName}), redireccionando al inicio`);
    return '/';
  }
}
