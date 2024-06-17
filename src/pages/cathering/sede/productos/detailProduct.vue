<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    :label2="producto.datosBasicos.nombre"
    href="/cathering/sede/productos"
  />

  <!--
      TITLE
      -- >

  <h1 class="text-lg font-extrabold uppercase text-center">
    {{ producto.datosBasicos.nombre }}
  </h1>

  < !--
    TABS
    -->

  <q-tabs
    v-model="estado.tab"
    inline-label
    outside-arrows
    mobile-arrows
    class="bg-grey-7 text-white shadow-2"
    align="justify"
    no-caps
  >
    <!-- 
    <div class="!flex h-full">
      <q-btn icon="arrow_back" flat />
        <q-btn icon="apps_outage" flat /> 
    </div>
        -->
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab v-if="soloAlmacen" name="marcas" icon="group" label="Marcas" />
    <q-tab
      v-if="soloAlmacenAdquisicion"
      name="medidas"
      icon="folder_copy"
      label="Medidas & Empaques"
    />
    <q-tab
      v-if="soloAdquisicion"
      name="proveedores"
      icon="query_stats"
      label="Proveedores"
    />
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>

  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <!-- 
    DATOS BASICOS 
  -->

    <q-tab-panel name="datosBasicos" animated>
      <p>Entre los datos basicos del producto:</p>
      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            v-model="producto.datosBasicos.nombre"
            type="text"
            class="w-full"
            filled
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
          />
        </div>
      </div>

      <!-- Categoria -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Categoria*"
            required
            v-model="producto.datosBasicos.categoria"
            :options="options"
            filled
            options-cover
            id="two-level-select"
            class="w-full"
            map-options
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.label }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          />
        </div>
      </div>

      <!-- Imagen -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <q-img
          style="width: 150px; height: 150px; object-fit: cover"
          v-if="imagePreview"
          :src="imagePreview"
        ></q-img>
        <div style="flex-grow: 1">
          <q-file
            class="w-full"
            v-model="imagen"
            label="Imagen"
            accept=".jpg, .png, .jpge"
            max-total-size="560000"
            @rejected="onRejected"
            counter
            filled
            hint="Tamaño máximo de imagen 540KB"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
          </q-file>
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor elija una foto donde el producto este solo y se distingue claramente ante un fondo claro unido. Prefiera un formato cuadrado."
          />
        </div>
      </div>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="producto.datosBasicos.comentario"
            type="textarea"
            label="Comentario"
            filled
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          />
        </div>
      </div>

      <!--div class="flex gap-4 justify-center">
        <q-btn
          color="secondary"
          label="Cancelar"
          no-caps
          @click="cancelarEdicionProductoBasico"
        /-->
      <q-btn
        color="primary"
        label="Guardar"
        no-caps
        @click="editarProductoBasico"
      />
    </q-tab-panel>

    <!-- 
    MARCAS 
  -->
    <q-tab-panel name="marcas" animated>
      <p>Seleccione las diferentes marcas con que viene el producto.</p>
      <!-- <code>{{ useProduct.producto.variedades }}</code> -->

      <Table
        :rows="useProduct.producto.variedades"
        :columns="marcas"
        style="padding: 0"
        badge
      >
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Registrar una marca"
            no-caps
            @click="
              () => {
                limpiarCamposMarca();
                estado.modal.esCrearMarcaProducto = true;
                estado.modal.esEditarMarca = false;
              }
            "
          />
        </template>
        <template #rows-badge="{ props }">
          <q-tr :props="props">
            <q-td key="imagen" :props="props" class="">
              <q-img
                v-if="props.row.imagen"
                :src="props.row.imagen.cloudinaryUrl"
                spinner-color="black"
                class="cell-image"
                width="40px"
                height="40px"
              />
              <!-- <q-img
              v-else
              :src="Oferta"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            /> -->
            </q-td>
            <q-td key="marca" :props="props">
              {{ props.row.marca.nombre }}
            </q-td>
            <q-td key="min" :props="props">
              {{ props.row.cantidadMin }}
            </q-td>
            <q-td key="max" :props="props">
              {{ props.row.cantidadMax }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                color="orange"
                icon="edit"
                round
                dense
                padding="1px"
                size="10px"
                @click="abrirModalEditarMarca(props.row)"
              >
                <q-tooltip> Editar marca </q-tooltip></q-btn
              >
            </q-td>
          </q-tr>
        </template>
      </Table>
    </q-tab-panel>

    <!-- 
    MEDIDAS 
  -->

    <q-tab-panel name="medidas" animated>
      <p>
        La medida básica es la forma en que se maneja el producto (por peso,
        unidad, etc).
      </p>
      <div class="flex flex-col mt-3 mb-3">
        <div
          v-if="
            !useProduct.producto.empaques ||
            (useProduct.producto.empaques &&
              useProduct.producto.empaques.length === 0)
          "
        >
          <div v-if="!estado.medidaProducto.medida">
            <p>
              Para poder agregar empaques, primero debes definir la medida
              basica.
            </p>
          </div>

          <div
            class="flex"
            style="justify-content: space-between; margin: 10px 0"
          >
            <div style="flex-grow: 1">
              <q-select
                label="Medida basica"
                v-model="estado.medidaProducto.medida"
                :options="estado.medidas"
                option-label="nombre"
                emit-value
                use-input
                outlined
                dense
                input-debounce="0"
                hide-selected
                fill-input
                onfocus="this.select()"
                class="w-full"
              >
                <template v-slot:append>
                  <q-icon
                    style="margin: 0"
                    name="close"
                    @click.stop.prevent="estado.medidaProducto.medida = ''"
                    class="cursor-pointer q-mr-md"
                  />
                </template>
                <template v-slot:prepend>
                  <q-icon name="straighten" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div>
              <q-btn
                size="12px"
                icon="add"
                color="primary"
                round
                style="height: 16px"
                @click="estado.modal.esCrearMedida = true"
              ></q-btn>
            </div>

            <div>
              <BotonDetalle
                mensaje="Seleccione una marca entre todas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
              />
            </div>

            <div class="!flex flex-row w-full gap-3 items-center">
              <q-btn
                v-if="
                  useProduct.producto.empaques &&
                  useProduct.producto.empaques.length === 0
                "
                class="display-block mx-auto mt-1"
                color="primary"
                label="Guardar medida basica"
                dense
                no-caps
                padding="3px 20px"
                @click="fnGuardarMedidaBasica"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div style="flex-grow: 1">
            <q-select
              label="Medida basica"
              v-model="estado.medidaProducto.medida"
              :options="estado.medidas"
              option-label="nombre"
              emit-value
              use-input
              outlined
              dense
              disable
              input-debounce="0"
              hide-selected
              fill-input
              onfocus="this.select()"
              class="w-full"
            >
              <template v-slot:append>
                <q-icon
                  style="margin: 0"
                  name="close"
                  @click.stop.prevent="estado.medidaProducto.medida = ''"
                  class="cursor-pointer q-mr-md"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="straighten" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div v-if="estado.medidaProducto.medida">
          <br />

          <p>
            Los empaques son la formas que llegan en producto en el almacén, por
            ejemplo en tira o paquete de tal o tal marca.
          </p>
          <div v-if="useProduct.producto.variedades?.length === 0">
            <p>
              Para poder agregar empaques, primero debes agregar por lo menos
              una marca al producto.
            </p>
          </div>
          <Table :rows="useProduct.producto.empaques" :columns="empaques">
            <template #dropdown>
              <q-btn
                color="primary"
                icon="add"
                label="Agregar empaque"
                no-caps
                :disable="useProduct.producto.variedades?.length === 0"
                @click="
                  () => {
                    limpiarCamposEmpaque();
                    estado.modal.esEditarEmpaque = false;
                    estado.modal.isAddEmpaque = true;
                  }
                "
              />
            </template>

            <template #body-cell-actions="{ props }">
              <q-td :props="props" class="font-bold text-red-500">
                <q-btn
                  color="orange"
                  icon="edit"
                  round
                  dense
                  padding="1px"
                  size="10px"
                  @click="abrirModalEditarEmpaque(props.row)"
                >
                  <q-tooltip> Editar empaque </q-tooltip></q-btn
                >
              </q-td>
            </template>
          </Table>
        </div>
      </div>
    </q-tab-panel>

    <!-- 
    PROVEEDORES 
  -->

    <q-tab-panel name="proveedores" animated>
      <p>Proveedores</p>

      <Table :rows="estado.proveedoresProducto" :columns="proveedores">
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar proveedores"
            no-caps
            @click="
              () => {
                limpiarCamposProveedor();
                estado.modal.esEditarProveedor = false;
                estado.modal.isAddProveedor = true;
              }
            "
          />
        </template>
        <template #body-cell-actions="{ props }">
          <q-td :props="props" class="font-bold text-red-500">
            <q-btn
              color="orange"
              icon="edit"
              round
              dense
              padding="1px"
              size="10px"
              @click="abrirModalEditarProveedor(props.row)"
            >
              <q-tooltip> Editar proveedor </q-tooltip></q-btn
            >
          </q-td>
        </template>
      </Table>
    </q-tab-panel>

    <!-- 
    PROVEEDORES 
  -->

    <q-tab-panel name="acciones" animated>
      <p>Indica el motivo por cual desea borrar este producto:</p>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="producto.motivoEliminacion"
            type="textarea"
            label="Motivo"
            filled
          />
        </div>
        <div>
          <BotonDetalle mensaje="Se avisará el jefe de logistica." />
        </div>
      </div>
      <q-btn
        color="primary"
        label="Confirmar"
        :disable="producto.motivoEliminacion === ''"
        no-caps
        @click="borrarProducto()"
      />
    </q-tab-panel>
  </q-tab-panels>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.dialog.isAddPresentation"
    :title="
      estado.dialog.isEditPresentation
        ? 'Editar presentacion'
        : 'Agregar presentacion'
    "
    :handle-submit="
      estado.dialog.isEditPresentation
        ? modificarPresentacion
        : agregarPresentacion
    "
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model="estado.presentacion.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-input
          v-model.number="estado.presentacion.cantidad"
          type="number"
          label="cantidad"
          outlined
          dense
        />
      </div>
    </template>
  </Dialog>

  <!-- PRODUCTO MARCA -->
  <Dialog2
    v-model="estado.modal.esCrearMarcaProducto"
    :title="estado.modal.esEditarMarca ? 'Modificar marca' : 'Registrar marca'"
    :label-btn="estado.modal.esEditarMarca ? 'Modificar' : 'Crear'"
    :handle-submit="
      estado.modal.esEditarMarca ? editarProductoMarca : agregarProductoMarca
    "
  >
    <template #inputsDialog>
      <p>Se va registrar una marca para este producto.</p>

      <!-- input marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            v-model="estado.marcaProducto.marca"
            :options="estado.marcas"
            option-label="nombre"
            class="w-full"
            map-options
            options-cover
            dense
            filled
            :disable="estado.modal.esEditarMarca"
          >
            <!--  
            fill-input
            emit-value
            use-input
            outlined
            input-debounce="0"
            hide-selected
            onfocus="this.select()" -->

            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.nombre }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearMarca = true"
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
          />
        </div>
      </div>

      <!-- input imagen -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <q-img
          style="width: 150px; height: 150px; object-fit: cover"
          v-if="imagePreviewMarca"
          :src="imagePreviewMarca"
        ></q-img>
        <div style="flex-grow: 1">
          <q-file
            class="w-full"
            v-model="imagenMarca"
            label="Imagen"
            accept=".jpg, .png, .jpge"
            max-total-size="560000"
            @rejected="onRejected"
            counter
            filled
            hint="Tamaño máximo de imagen 540KB"
            clearable
            dense
            :disable="estado.modal.esEditarMarca"
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
          </q-file>
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. La marca debe ser legible. Prefiera un formato cuadrado."
          />
        </div>
      </div>

      <!-- input cantidadMin -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Stock minimo antes de hacer pedido *"
            required
            class="w-full"
            v-model.number="estado.marcaProducto.minimo"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
          />
        </div>
      </div>

      <!-- input cantidadMax -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Cantidad max en un pedido *"
            required
            class="w-full"
            v-model.number="estado.marcaProducto.maximo"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad maxima que un punto puede pedir a produccion, para evitar errores inecesarias."
          />
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO MARCA -->
  <!-- <Dialog2
    v-model="estado.modal.esEditarMarca"
    title="Modificar una marca"
    label-btn="Guardar"
    :handle-submit="editarProductoMarca"
  >
    <template #inputsDialog>
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Stock minimo antes de hacer pedido *"
            required
            class="w-full"
            v-model.number="estado.marcaProducto.cantidadMin"
            type="number"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad en stock del producto debajo de la cual una alerta será generada para avisar que se necesita hacer un nuevo pedido al proveedor."
          />
        </div>
      </div>

      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Pedido Maximo *"
            required
            class="w-full"
            v-model.number="estado.marcaProducto.cantidadMax"
            type="number"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad maxima que se puede pedir a produccion, su utilidad es de disminuir el riesgo de error cuando un punto hace un pedidos."
          />
        </div>
      </div>
    </template>
  </Dialog2> -->

  <!-- 
    MEDIDA & EMPAQUE 
  -->

  <Dialog2
    v-model="estado.modal.isAddEmpaque"
    :title="
      estado.modal.esEditarEmpaque ? 'Modificar empaque' : 'Agregar empaque'
    "
    :label-btn="estado.modal.esEditarEmpaque ? 'Modificar' : 'Crear'"
    :handle-submit="
      estado.modal.esEditarEmpaque
        ? editarEmpaqueProducto
        : editarProductoMedidaEmpaque
    "
  >
    <template #inputsDialog>
      <p>Registren las diferentes presentaciones</p>
      <!--   <h1 class="font-bold text-xs mt-2">MARCA:</h1>
      <q-select
        color="primary"
        v-model="estado.medidaProducto.marca"
        :options="useProduct.producto.variedades"
        label="Seleccionar marca"
        :option-label="(option) => option.marca?.nombre"
        emit-value
        use-input
        outlined
        dense
        input-debounce="0"
        hide-selected
        fill-input
        onfocus="this.select()"
        class="w-full"
      >
        <template v-slot:append>
          <q-icon
            style="margin: 0"
            name="close"
            @click.stop.prevent="brandSelected = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="branding_watermark" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <h1 class="font-bold text-xs mt-2">EMPAQUE:</h1>
      <div class="!flex flex-row w-full gap-3 items-center">
        <q-select
          color="primary"
          v-model="estado.medidaProducto.empaque"
          :options="estado.medidaProducto.medida.tipoEmpaques"
          label=""
          option-label="nombre"
          emit-value
          use-input
          outlined
          dense
          input-debounce="0"
          hide-selected
          fill-input
          onfocus="this.select()"
          class="w-full"
          :disable="estado.medidaProducto.medida.nombre === ''"
          required
        >
          <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.medidaProducto.empaque = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="bi-box2" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearEmpaque = true"
        ></q-btn>
      </div> -->

      <!-- input marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            filled
            class="w-full"
            v-model="estado.medidaProducto.marca"
            :options="
              useProduct.producto.variedades.map((variedad) => variedad.marca)
            "
            option-label="nombre"
            map-options
            dense
          >
            <!--  
            fill-input
            emit-value
            use-input
            outlined
            input-debounce="0"
            hide-selected
            onfocus="this.select()" -->

            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.nombre }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="Seleccione una marca entre las que ya se registraron para este producto. Si la marca que desea ingresar no existe, agregue la primero en la zona MARCAS."
          />
        </div>
      </div>

      <!-- input empaque -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Empaque *"
            required
            filled
            class="w-full"
            v-model="estado.medidaProducto.empaque"
            :options="estado.medidaProducto.medida.tipoEmpaques"
            option-label="nombre"
            map-options
            dense
            :disable="
              estado.medidaProducto.medida.nombre === '' ||
              estado.modal.esEditarEmpaque
            "
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.nombre }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearEmpaque = true"
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="La medida básica viene con nombres de empaque predefinidos, seleccione uno o creelo si no existe."
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Abreviacion *"
            required
            class="w-full"
            v-model="estado.medidaProducto.empaque.abreviacion"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
          />
        </div>
      </div>

      <!-- input cantidad -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Cantidad en unidades básicas *"
            required
            class="w-full"
            v-model.number="estado.medidaProducto.empaque.cantidad"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad de unidades básicas que entran en este empaque, dependiendo de lo que se configuró : cantidades de unidades en una caja, o de mililitros/gramos en una bolsa, etc..."
          />
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO PROVEEDOR -->
  <Dialog2
    v-model="estado.modal.isAddProveedor"
    :title="
      estado.modal.esEditarProveedor
        ? 'Modificar proveedor'
        : 'Agregar proveedor'
    "
    :label-btn="estado.modal.esEditarProveedor ? 'Modificar' : 'Crear'"
    :handle-submit="
      estado.modal.esEditarProveedor
        ? editarProveedorProducto
        : agregarProductoProveedor
    "
  >
    <template #inputsDialog>
      <p>Se va registrar un proveedor para este producto.</p>

      <!-- proveedor -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Proveedor *"
            required
            v-model="estado.productoProveedor.proveedor"
            :options="estado.proveedores"
            option-label="nombre"
            class="w-full"
            emit-value
            dense
            filled
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearProveedor = true"
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="Elija un proveedor o crealo si no existe con el boton [+]"
          />
        </div>
      </div>

      <!-- marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            v-model="estado.productoProveedor.marca"
            :options="useProduct.producto.variedades"
            :option-label="(option) => option.marca?.nombre"
            emit-value
            class="w-full"
            dense
            filled
            :disable="estado.modal.esEditarProveedor"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="Seleccione la marca que vende este proveedor. Si la marca no existe, agregue la en la zona MARCAS."
          />
        </div>
      </div>

      <!-- input Identificativo -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Identificativo"
            v-model="estado.productoProveedor.identificativo"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La referencia del producto en el catalogo y las facturas del proveedor."
          />
        </div>
      </div>

      <!-- Sin factura -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Precio sin factura *"
            v-model.number="estado.productoProveedor.precioSinFactura"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Use el punto '.' como separador de decimales."
          />
        </div>
      </div>

      <!-- Con factura -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Precio con factura"
            v-model.number="estado.productoProveedor.precioConFactura"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Use el punto '.' como separador de decimales."
          />
        </div>
      </div>

      <div class="flex justify-between items-center mt-2 mb-1">
        <h1 class="font-bold text-xs">PRECIOS POR MAYOR:</h1>
        <q-btn
          color="primary"
          label="Agregar precio"
          dense
          no-caps
          padding="1px 6px"
          @click="estado.modal.esCrearPrecio = true"
        />
      </div>

      <table class="min-w-full bg-white rounded-sm overflow-hidden">
        <thead class="bg-teal-700 text-white">
          <tr class="[&>th]:py-1">
            <th class="text-center text-xs uppercase tracking-wider">
              Cantidad
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Precio C/F
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Precio S/F
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(precio, index) in estado.productoProveedor.precios"
            :key="index"
            class="[&>td]:border [&>td]:border-gray-400"
          >
            <td class="whitespace-nowrap text-center">
              {{ precio.cantidadMin }}
            </td>
            <td class="whitespace-nowrap text-center">
              {{ precio.precioConFactura }}
            </td>
            <td class="whitespace-nowrap text-center">
              {{ precio.precioSinFactura }}
            </td>
            <td class="whitespace-nowrap text-center">
              <q-btn color="primary" icon="edit" dense size="10px" flat />
              <q-btn color="red" icon="delete" dense size="10px" flat />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </Dialog2>

  <!-- CREAR MARCA -->
  <Dialog2
    v-model="estado.modal.esCrearMarca"
    title="Crear una marca"
    label-btn="Crear"
    :handle-submit="crearMarca"
  >
    <template #inputsDialog>
      <p>
        La marca se creará al nivel global,
        <b>asegúrese que todavía no existe</b>.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            class="w-full"
            v-model="estado.marcaProducto.marca.nombre"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Entre el nombre de la marca que aparece en la
          etiqueta del producto. Si es un producto generico y sin marca, YA
          EXISTE una marca generica llamada 'sin marca'."
          />
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- CREAR MEDIDA -->
  <Dialog2
    v-model="estado.modal.esCrearMedida"
    title="Crear medida"
    label-btn="Crear"
    :handle-submit="crearMedida"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">CREAR MEDIDA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          label="Nombre *"
          required
          v-model="estado.dataMedida.nombre"
          type="text"
          outlined
          dense
          clearable
        />
      </div>
    </template>
  </Dialog2>

  <!-- CREAR EMPAQUE -->
  <Dialog2
    v-model="estado.modal.esCrearEmpaque"
    title="Crear nombre de empaque"
    label-btn="Crear"
    :handle-submit="crearEmpaque"
  >
    <template #inputsDialog>
      <p>
        Registra un nombre de empaque que se podrá reutilizar para registrar
        empaques de productos.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            class="w-full"
            v-model="estado.dataEmpaque.nombre"
            type="text"
            filled
            dense
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Abreviacion *"
            required
            class="w-full"
            v-model="estado.dataEmpaque.abreviacion"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model.number="estado.dataEmpaque.cantidad"
            type="number"
            label="cantidad en unidades basicas"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La cantidad de unidades básicas del tipo de empaque (opcional) ; solo sirve para prellenar el formulario al crear un empaque del producto."
          />
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- CREAR PROVEEDOR ENTIDAD -->
  <Dialog2
    v-model="estado.modal.esCrearProveedor"
    title="Crear proveedor"
    label-btn="Crear"
    :handle-submit="crearProveedor"
  >
    <template #inputsDialog>
      <p>Se agregará un proveedor a la lista global de proveedores.</p>
      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            v-model="estado.dataProveedor.nombre"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
      </div>

      <!-- descripcion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Descripcion *"
            required
            v-model="estado.dataProveedor.descripcion"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          />
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- CREAR PRECIO -->
  <Dialog2
    v-model="estado.modal.esCrearPrecio"
    title="Agregar precio"
    label-btn="Crear"
    :handle-submit="agregarPrecio"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">AGREGAR PRECIO</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          label="Cantidad *"
          required
          v-model.number="estado.dataPrecio.cantidadMin"
          type="number"
          outlined
          dense
          clearable
        />
        <q-input
          label="Precio sin factura *"
          required
          v-model.number="estado.dataPrecio.precioSinFactura"
          type="number"
          outlined
          dense
          clearable
        />
        <q-input
          v-model.number="estado.dataPrecio.precioConFactura"
          type="number"
          label="Precio con factura"
          outlined
          dense
          clearable
        />
      </div>
    </template>
  </Dialog2>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { marcas, proveedores, empaques } from '~/helpers/columns';
import { useAuth } from '~/composables/auth/useAuth';

// Verificacion de permisos
const { checkPermisos } = useAuth();
if (!checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(checkPermisos(['ADQUISICION', 'ALMACEN']));

const {
  tags,
  agregarProducto,
  editProductBasicInfo,
  estado,
  useProduct,
  modalAgregarPresentacion,
  agregarPresentacion,
  modalEditarPresentacion,
  modificarPresentacion,
  borrarPresentacion,
  getCategoria,
  imagen,
  imagePreview,
  selectedFile,
  producto,
  editarDatosBasicos,
  nombre,
  editarProductoBasico,
  buscarMarcas,
  crearMarca,
  imagenMarca,
  imagePreviewMarca,
  agregarProductoMarca,
  getAllProductos,
  buscarMedidas,
  crearMedida,
  crearEmpaque,
  editarProductoMedidaEmpaque,
  buscarProveedores,
  crearProveedor,
  agregarPrecio,
  agregarProductoProveedor,
  buscarProveedoresProducto,
  guardarMedidaBasica,
  cancelarEdicionProductoBasico,
  estadoInicial,
  borrarProducto,
  abrirModalEditarMarca,
  limpiarCamposMarca,
  editarEmpaqueProducto,
  abrirModalEditarEmpaque,
  limpiarCamposEmpaque,
  abrirModalEditarProveedor,
  editarProveedorProducto,
  limpiarCamposProveedor,
  editarProductoMarca,
} = useProducts();

definePageMeta({
  layout: 'cathering',
});

const options = ref([]);
const showTable = ref(false); //estado.medidaProducto.medida;

const fnGuardarMedidaBasica = () => {
  guardarMedidaBasica();
  showTable.value = true;
};

if (useProduct.producto) {
  producto.productoID = useProduct.producto._id;
  producto.datosBasicos = useProduct.producto;
  estado.medidaProducto.medida = useProduct.producto.medida;
  imagePreview.value = useProduct.producto.imagen?.cloudinaryUrl;
  // console.log(producto.datosBasicos);
}

onMounted(async () => {
  await getCategoria();

  options.value = [];
  for (const cat of estado.categorias.hijas) {
    options.value.push({
      label: `${cat.nombre} (${cat.hijas.length})`,
      value: cat._id,
      disable: true,
      class: 'title',
    });
    for (const subcat of cat.hijas) {
      options.value.push({
        label: subcat.nombre,
        value: subcat,
        class: 'option',
      });
    }
  }

  buscarMarcas();
  buscarMedidas();
  buscarProveedores();
  buscarProveedoresProducto();
  // getAllProductos();

  estadoInicial.datosBasicos.nombre = producto.datosBasicos.nombre;
  estadoInicial.datosBasicos.categoria = producto.datosBasicos.categoria;
  estadoInicial.datosBasicos.comentario = producto.datosBasicos.comentario;
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
