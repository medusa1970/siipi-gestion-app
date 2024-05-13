## Tareas rapidas

- _DECIMALES_ : precio TOTAL 2 decimal.
- _TEXTO_ : "agregar categoria" debe volverse "agregar subcategoria" en modif catalogo / categoria ✅
- _LAYOUT DEMO_ : Cambiar los colores generales de la demo ✅
- _LAYOUT NEGOCIOS_ : Cambiar los colores generales de las diferentes empresas: sucursales NARANJA, Produccion VERDE, Sede siipi NEGRO ✅
- _NOMBRE DE DOMINIO_ : Configurar el nombre de dominio (xxx.sii-pi.com, decidir con Jaime) ✅
- _TITULOS DE PAGINAS_ : Cada pagina debe tener su título ✅
- _ACCESO CHOFERES_ : los choferes deben tener su acceso ya, en el cual podran solamente ver los pedidos, al recibirse un pedido entraran su propria contraseña ✅
- _TAREAS DIVERSAS WILL_ :
  EDITAR EMPLEADO
  rol mobile\*
  rol administrador en cathering.
  ver pedidos sucursal repartidor.
  ver infomracion de producto/oferta
  categoria scroll
  select catalogos ofertas

## ACLARAR LA CONFUSION

- _AGREGAR CAT AL CREAR PROD_ : Recuerdo que antes se podia agregar categoria desde la misma vista de cuando se creaba un producto, ahora si o si debes ir “categorías para agregar”?
- _FILTRAR PRODUCTOS POR CATEGORIAS_ : poder ver los productos filtrando por categoria
- _FILTRAR OFERTAS POR CATALOGO_ : poder ver los ofertas filtrando por catalogo y agregar una oferta en el cat corriente
- _CATEGORIAS_: aclarar las categorias "consumibles", "panaderia", "reposteria" que es confuso, y ver si hay los campos para modificar los tags de oferta "isPanaderia", "isReposteria", etc... >>>> ACLARAR, todo esta confuso
- \*CATEGORIAS CONFUSAS" : Panaderia + reposteria + consumibles

## Tareas mas o menos urgentes

- _MANUAL_ : Un manual para cada seccion : boton de manual ? Hacer una video de tutorial
- _BORRAR PRODUCTO_: Motivo y contraseña para validar esto y que llegue una notificación a DIRECTORA DE MARCA como un “pendiente de revision” para que anañlice el motivo, y lo solucione (misma funcionalidad de inventarios) > solo desactivar productos ? o bien que sola la directora de marca lo pueda borrar ?
- _OFERTAS SIN DUPLICAR_: al crear un producto, asegurarse que no existe ya una oferta similar, o por lo menos avisar si ya hay productos similares
- _PROVEEDORES BASICOS_ : Ya guardar una lista de proveedores basicos, una coleccion "Compras_Proveedor" : [ provedor, producto, precio, fecha ] con crud basico seria facil ? Vania ya quiere asociar un precio con unprovedor.
- _FLUJOGRAMA_ : Tener la architectura lista con TODOS los roles que estaran a futuro, definiendo su nombre y lo que van a poder hacer ; Crear los usuarios y los accesos aunque sea básico.
  Cathering : Administracion Supervision Almacen Reparticion Distribucion ?
  Punto : Administracion, Cajero, Mesero, Limpieza, Tesoreria ?
- _EDICION DE CATEGORIA_ : poder editar o mover una categoria

## Tareas urgentes

- _ABREVIACION PRODUCTO_ : tanto al crear producto, como al colocarlo en una oferta (para que eso salga en la factura) : otro campo de formulario, con un numero maximo de caracteres?
- _ESTADO DE REVISION_ : Por esta primera vez se haga un estado de REVISIÓN, teniendo en cuenta que se importaron datos incluso de productos que ya no se venden, cosa de que se sepa que productos ya se revisaron, y cuales estan pendientes >> Se podria poner un campor para filtrar o bien poder ordenar por fecha de ultima modificacion

## Metas

- _OFERTAS MULTI PRODUCTOS_ : Hacer un ejemplo de como crear producto la bandeja de cupcakes: Producto de cantidades múltiples como el balde
- _PROVEEDORES SIMPLES_ : proveedores (cambios de precios) y sistema de alertas de cambios de precios
- _TESORERIA_ : con transacciones, y integrarlo con proveedores
- _AREAS_ : acceso completo a areas que podran transformar productos y mandar / recibir pedidos >>> hacer wireframes
- _COPIA LOCAL_ : Trabajar en la copia local de base de datos para no depender de la internet / que las consultas esten mas rapidas :
  - separar las funcionalidades locales (pedido clientes) y distantes (pedido cathering)
  - poner ambas apps en el mismo servidor
  - Ver con Jaime
- _NOTIFICACIONES_ : sistema de notificacion (mensajes dm, problemas, ediciones por otros empleados, aviso de devoluciones...)
- _ROLES_ : reorganizar sistema de cargo / roles / permisos
- _CALCULO DE RECETAS_ : integrarlo al sistema

## No entiendo, Aclarar :

EDITAR PEDIDOS POR RANGOS DENTRO DE DETERMINADOS TIEMPOS:
