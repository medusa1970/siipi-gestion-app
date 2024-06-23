export default function (router: any, routeName: string) {
  const route = router.getRoutes().find((r: any) => r.name === routeName);
  if (route) {
    router.push(route);
  } else {
    console.warn(`Ruta desconocida (${routeName})`);
  }
}
