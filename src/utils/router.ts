function replaceParamsInRoute(route, params) {
  const regex = new RegExp(`:(${Object.keys(params).join("|")})`, "g");
  return route.replace(regex, (match, p) => params[p]);
}

export const getRoute = function (
  router: any,
  routeName: string,
  params: any = null
) {
  const route = router.getRoutes().find((r: any) => r.name === routeName);
  let path = "";
  if (route) {
    path = params ? replaceParamsInRoute(route.path, params) : route.path;
  } else {
    console.warn(`Ruta desconocida (${routeName}), redireccionando al inicio`);
  }
  return "/" + path.replace(/^(\/)+|(\/)+$/g, "");
};

export const goTo = function (
  router: any,
  routeName: string,
  params: any = null
) {
  router.push(getRoute(router, routeName, params));
};
