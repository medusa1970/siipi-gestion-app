# META 4

buscarPedido por entidad.

HACER PEDIDO PUNTO, MENU CATALOGOS, SI HAY ofertas en el catalogo arbol solo que no renderiza las ofertas
de lado del cliente, revisar y arresglar.

IDEAS PEDIDOS

- factura no modificable. si se equivoco y le falta productos seria otro pedido.
- Encargado almacen realiza el pedido:
  ej1.- llame al proveedor pil y le diga si hay tantos productos para que realize el pedido el enecargado
  ej2.- llame a los proveedores de HUEVO para ver de quien comprar, asi elige el mejor precio,
  EL SISTEMA SOLO GUARDA NUMEROS DE PROVEEDORES Y SU NOMBRE: para que encargado pueda saber su informacion y
  a quien consultar.
  -TESORIA SOLO MUESTRA SUELDO BASICO. CATHERING/PUNTO
  ACTIVIDAD: [iniciado,pausado,reactivado,cobrado,archivado]
  ACTIVIDAD PRODUCTOS: [confirmado, encargado, preparado, despachado, entregado, aceptado, finalizado, anulado, reactivado]

ACTIVIDAD PUNTO: [iniciado, pausado, reactivado].
ACTIVIDAD CATHERING: [aceptado, entregado ].
ACTIVIDAD PUNTO: [recibido, finalizado ].

- QUE SE PUEDE ELEGIR A QUE ENTIDAD REALIZAR EL PEDIDO.

OPINION.

- que la cajera pueda hacer consulta del stock de otras sucursales apra redireccionar al cliente si no hay producto en su sucursal.

- Arreglar funcion en la parte de hacer/terminarInventario.
- Refactorizar solucionProblemasInventario.
- editar cargo y permisos en una vista.
- refactorizar estructura de carpetas del front ✅.
- limpiar y ordenar, revisar el codigo antes del miercoles 1/25 ✅.
- empleadoss/..; ✅.
- poner fotos. MANDAR DIMENSIONES. ✅.
- buscar Producto SEDE no sirve.

CATHERING

- ver pedidos Hechos por puntos (ver estado, aceptar pedido entrante). ✅(LOGICA)
- ver pedidos realizados a proveedor. ✅(LOGICA)
- realizar pedido a PROVEEDOR. ✅(LOGICA)
- historial pedidos.✅(LOGICA)

PUNTO

- ver pedidos realizados a punto(estado). ✅(LOGICA)
- realizar pedido a CATHERING. ✅(LOGICA)
- historial pedidos. ✅(LOGICA)

- Ver pedidos compra/venta PUNTO/CATHERING (ESTADO). ✅(LOGICA)
- Realizar Pedidos Proveedor CATHERING. ✅(LOGICA)
- Realizar Pedidos a Produccion PUNTO. ✅(LOGICA)
- Formato y recopilacion de datos Para impresion de factura de pedidos. **\***.
  [ FACTURA:

* fecha de inicio de pedido,
* Entidad origen
* Entidad Destino
* Usuario
* CI
* LOGO SIIPI
* ATENCION AL CONSUMIDOR
  ]

- EL PEDIDO SE HACE A UNA OFERTA O A UN PRODUCTO? por que el producto no tiene precio, entonces se crearia una oferta para un producto, para pedir ese con su respetivo precio, entonces el stock entra la oferta y no producto y la ofertas tiene varias ofertas dentro y ya no productos. pero el stock si la oferta JUGO(tiene baso, bombilla) baso y jugo seria una oferta con precio de un producto, entonces esa oferta entra a stock pero al entrar la oferta stock entraria en stock hasta el jugos 2x1 :(.

- Cambiar la estructura a algo mas simple ✅.

!IMPORTANT:

- PUNTO (Menu, crear menu, al crear que jale un catalogo, y de exepciones de productos.) ✅.
- PUNTO (Inventario, al crear un menu renderiza una lista para inventariar de todos los productos del menu creado para almacenar en stock.) ✅.
- CONSULTAS (MENU, CATALOGO ARBOL para jalar un catalogo.) ✅.
- MAQUETAR ✅.

- AREAS CATHERING ...................META 5
- FORMULARIO TEMPORAL PARA AGREGAR PRODUCTOS DE COMPRA PROVEEDORES
- TESORERIA BASICA que los puntos hacen pedidos a cathering y cathering tendra su estado de cuenta. CUANDO TENGA PEDIDOs
- lista de transacciones compra y venta actualizar su estado de cuenta.
- Pedidos estados.
- SOLO UN ACCESO ADMINISTRADOR todavia no permisos ✅

* WHITEBOARD

- categoria de ofertas, el menu es el que se visualiza en el punto, o menu tambien importa su categorias de los catalogos segun a que nivel pertenecen las ofertas.

* IMAGEN LEO

- ofertas(), persona(empleadores, propietarios), entidad (sede,marca,punto) ✅
- Tamano de imagen menos de 2MB ✅
- dimension, 564x564 PX ✅
- Formato JPEG, JPG, PNG ✅

# META 3

- pagina de catalogos (modificado x Lionel) ❌✅
- cambiar la consulta de la pagina de stocks ❌

# REUNION 1/26/24

- SEDE.- maneja productos, crea los puntos, punto crea su menu, acceso a todas las personas registradas.
- PUNTO .- stock, inventario, pedidos, empleados.
- MARCA .- crear catalogos, crear ofertas dentro de catalogos. !ASIGNA MENU A PUNTO!.
  catalogo siipime, catalogo siimple, catalogo cathering.

- MARCA - PRODUCCION
- PUNTO-CATHERING
