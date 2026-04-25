import { test, expect } from './fixtures';
import { usuarios, datosCheckout, productos, resumenPedido, ordenamiento } from '../data/datosPrueba';

test.describe('Sauce Demo — Flujo E2E Ecommerce', () => {

  // ─────────────────────────────────────────────────────
  // CP-001 — Login exitoso
  // ─────────────────────────────────────────────────────
  test('CP-001 - Login exitoso con usuario valido', async ({ loginPage, inventarioPage }) => {
    await loginPage.login(
      usuarios.valido.usuario,
      usuarios.valido.password
    );
    await loginPage.validarLoginExitoso();
    await inventarioPage.validarInventarioCargado();
  });

  // ─────────────────────────────────────────────────────
  // CP-002 — Login usuario bloqueado
  // ─────────────────────────────────────────────────────
  test('CP-002 - Login con usuario bloqueado', async ({ loginPage }) => {
    await loginPage.login(
      usuarios.bloqueado.usuario,
      usuarios.bloqueado.password
    );
    await loginPage.validarPermanenceEnLogin();
    await loginPage.validarMensajeError('Sorry, this user has been locked out');
  });

  // ─────────────────────────────────────────────────────
  // CP-003 — Login usuario inexistente
  // ─────────────────────────────────────────────────────
  test('CP-003 - Login con usuario inexistente', async ({ loginPage }) => {
    await loginPage.login(
      usuarios.inexistente.usuario,
      usuarios.inexistente.password
    );
    await loginPage.validarPermanenceEnLogin();
    await loginPage.validarMensajeError('Username and password do not match');
  });

  // ─────────────────────────────────────────────────────
  // CP-004 — Login ambos campos vacios
  // ─────────────────────────────────────────────────────
  test('CP-004 - Login con ambos campos vacios', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.validarPermanenceEnLogin();
    await loginPage.validarMensajeError('Username is required');
  });

  // ─────────────────────────────────────────────────────
  // CP-005 — Login solo contrasena sin usuario
  // ─────────────────────────────────────────────────────
  test('CP-005 - Login solo con contrasena sin usuario', async ({ loginPage }) => {
    await loginPage.login('', usuarios.valido.password);
    await loginPage.validarPermanenceEnLogin();
    await loginPage.validarMensajeError('Username is required');
  });

  // ─────────────────────────────────────────────────────
  // CP-006 — Login solo usuario sin contrasena
  // ─────────────────────────────────────────────────────
  test('CP-006 - Login solo con usuario sin contrasena', async ({ loginPage }) => {
    await loginPage.login(usuarios.valido.usuario, '');
    await loginPage.validarPermanenceEnLogin();
    await loginPage.validarMensajeError('Password is required');
  });

  // ─────────────────────────────────────────────────────
  // CP-007 — Agregar y remover producto
  // ─────────────────────────────────────────────────────
  test('CP-007 - Agregar y remover producto desde catalogo', async ({ autenticado: _autenticado, inventarioPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.validarBotonRemoverVisible(productos.backpack.nombre);
    await inventarioPage.validarContadorCarrito('1');
    await inventarioPage.removerProducto(productos.backpack.nombre);
    await inventarioPage.validarBotonAgregarVisible(productos.backpack.nombre);
    await inventarioPage.validarContadorDesaparecio();
  });

  // ─────────────────────────────────────────────────────
  // CP-008 — Inventario navega al detalle sin agregar al carrito
  // ─────────────────────────────────────────────────────
  test('CP-008 - Inventario navega al detalle del producto sin agregar al carrito', async ({ autenticado: _autenticado, inventarioPage, detalleProductoPage }) => {
    await inventarioPage.clickNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarURLDetalle();
    await detalleProductoPage.validarNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarPrecioProducto(productos.backpack.precio);
    await detalleProductoPage.validarBotonAddToCartVisible();
    await detalleProductoPage.clickAddToCart();
    await detalleProductoPage.validarBotonRemoveVisible();
    await inventarioPage.validarContadorCarrito('1');
    await detalleProductoPage.clickBackToProducts();
    await inventarioPage.validarInventarioCargado();
  });

  // ─────────────────────────────────────────────────────
  // CP-009 — Inventario navega al detalle producto ya en carrito
  // ─────────────────────────────────────────────────────
  test('CP-009 - Inventario navega al detalle del producto ya agregado al carrito', async ({ autenticado: _autenticado, inventarioPage, detalleProductoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.clickNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarURLDetalle();
    await detalleProductoPage.validarBotonRemoveVisible();
    await detalleProductoPage.clickRemove();
    await inventarioPage.validarContadorDesaparecio();
    await detalleProductoPage.clickBackToProducts();
    await inventarioPage.validarInventarioCargado();
  });

  // ─────────────────────────────────────────────────────
  // CP-022 — Ordenar Name (A to Z)
  // ─────────────────────────────────────────────────────
  test('CP-022 - Ordenar productos por nombre A to Z', async ({ autenticado: _autenticado, inventarioPage }) => {
    await inventarioPage.seleccionarFiltro(ordenamiento.nombreAZ.opcion);
    expect(await inventarioPage.obtenerPrimerNombreProducto()).toBe(ordenamiento.nombreAZ.primerNombre);
    expect(await inventarioPage.obtenerUltimoNombreProducto()).toBe(ordenamiento.nombreAZ.ultimoNombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-023 — Ordenar Name (Z to A)
  // ─────────────────────────────────────────────────────
  test('CP-023 - Ordenar productos por nombre Z to A', async ({ autenticado: _autenticado, inventarioPage }) => {
    await inventarioPage.seleccionarFiltro(ordenamiento.nombreZA.opcion);
    expect(await inventarioPage.obtenerPrimerNombreProducto()).toBe(ordenamiento.nombreZA.primerNombre);
    expect(await inventarioPage.obtenerUltimoNombreProducto()).toBe(ordenamiento.nombreZA.ultimoNombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-024 — Ordenar Price (low to high)
  // ─────────────────────────────────────────────────────
  test('CP-024 - Ordenar productos por precio de menor a mayor', async ({ autenticado: _autenticado, inventarioPage }) => {
    await inventarioPage.seleccionarFiltro(ordenamiento.precioAscendente.opcion);
    expect(await inventarioPage.obtenerPrimerPrecioProducto()).toBe(ordenamiento.precioAscendente.primerPrecio);
    expect(await inventarioPage.obtenerUltimoPrecioProducto()).toBe(ordenamiento.precioAscendente.ultimoPrecio);
  });

  // ─────────────────────────────────────────────────────
  // CP-025 — Ordenar Price (high to low)
  // ─────────────────────────────────────────────────────
  test('CP-025 - Ordenar productos por precio de mayor a menor', async ({ autenticado: _autenticado, inventarioPage }) => {
    await inventarioPage.seleccionarFiltro(ordenamiento.precioDescendente.opcion);
    expect(await inventarioPage.obtenerPrimerPrecioProducto()).toBe(ordenamiento.precioDescendente.primerPrecio);
    expect(await inventarioPage.obtenerUltimoPrecioProducto()).toBe(ordenamiento.precioDescendente.ultimoPrecio);
  });

  // ─────────────────────────────────────────────────────
  // CP-010 — Compra E2E completa
  // ─────────────────────────────────────────────────────
  test('CP-010 - Compra E2E completa de punta a punta', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage, confirmacionPage }) => {
    // Inventario — agregar productos
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.agregarProducto(productos.bikeLight.nombre);
    await inventarioPage.validarContadorCarrito('2');
    await inventarioPage.irAlCarrito();

    // Carrito — validar productos
    await carritoPage.validarCarritoCargado();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
    await carritoPage.validarProductoEnCarrito(productos.bikeLight.nombre);
    await carritoPage.validarPrecioProducto(productos.backpack.nombre, productos.backpack.precio);
    await carritoPage.validarPrecioProducto(productos.bikeLight.nombre, productos.bikeLight.precio);
    await carritoPage.validarCantidadProductos(2);
    await carritoPage.irAlCheckout();

    // Checkout — llenar formulario
    await checkoutPage.validarFormularioCargado();
    await checkoutPage.llenarFormulario(
      datosCheckout.valido.nombre,
      datosCheckout.valido.apellido,
      datosCheckout.valido.cp
    );
    await checkoutPage.clickContinuar();

    // Resumen — validar orden
    await checkoutPage.validarResumenCargado();
    await checkoutPage.validarProductoEnResumen(productos.backpack.nombre);
    await checkoutPage.validarProductoEnResumen(productos.bikeLight.nombre);
    await checkoutPage.validarPrecioProductoEnResumen(productos.backpack.nombre, productos.backpack.precio);
    await checkoutPage.validarPrecioProductoEnResumen(productos.bikeLight.nombre, productos.bikeLight.precio);
    await checkoutPage.validarResumenVisible();
    await checkoutPage.validarPaymentInfo(resumenPedido.paymentInfo);
    await checkoutPage.validarShippingInfo(resumenPedido.shippingInfo);
    await checkoutPage.validarItemTotal(resumenPedido.itemTotal);
    await checkoutPage.validarImpuesto(resumenPedido.tax);
    await checkoutPage.validarTotal(resumenPedido.total);

    await checkoutPage.clickFinish();

    // Confirmacion
    await confirmacionPage.validarConfirmacionCompleta();
  });

  // ─────────────────────────────────────────────────────
  // CP-011 — Checkout todos los campos vacios
  // ─────────────────────────────────────────────────────
  test('CP-011 - Checkout con todos los campos vacios', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.sinNombre.nombre,
      datosCheckout.sinNombre.apellido,
      datosCheckout.sinNombre.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarMensajeError('First Name is required');
    await checkoutPage.validarPermanenceEnFormulario();
  });

  // ─────────────────────────────────────────────────────
  // CP-012 — Checkout sin apellido
  // ─────────────────────────────────────────────────────
  test('CP-012 - Checkout sin apellido', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.sinApellido.nombre,
      datosCheckout.sinApellido.apellido,
      datosCheckout.sinApellido.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarMensajeError('Last Name is required');
    await checkoutPage.validarPermanenceEnFormulario();
  });

  // ─────────────────────────────────────────────────────
  // CP-013 — Checkout sin zip code
  // ─────────────────────────────────────────────────────
  test('CP-013 - Checkout sin zip code', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.sinCp.nombre,
      datosCheckout.sinCp.apellido,
      datosCheckout.sinCp.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarMensajeError('Postal Code is required');
    await checkoutPage.validarPermanenceEnFormulario();
  });

  // ─────────────────────────────────────────────────────
  // CP-014 — Carrito navega al detalle del producto
  // ─────────────────────────────────────────────────────
  test('CP-014 - Carrito navega al detalle del producto', async ({ autenticado: _autenticado, inventarioPage, carritoPage, detalleProductoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.clickNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarURLDetalle();
    await detalleProductoPage.validarNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarPrecioProducto(productos.backpack.precio);
    await detalleProductoPage.validarBotonRemoveVisible();
    await detalleProductoPage.clickBackToProducts();
    await inventarioPage.validarInventarioCargado();
  });

  // ─────────────────────────────────────────────────────
  // CP-015 — Resumen navega al detalle del producto
  // ─────────────────────────────────────────────────────
  test('CP-015 - Resumen navega al detalle del producto', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage, detalleProductoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.valido.nombre,
      datosCheckout.valido.apellido,
      datosCheckout.valido.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarResumenCargado();
    await checkoutPage.clickNombreProductoEnResumen(productos.backpack.nombre);
    await detalleProductoPage.validarURLDetalle();
    await detalleProductoPage.validarNombreProducto(productos.backpack.nombre);
    await detalleProductoPage.validarPrecioProducto(productos.backpack.precio);
    await detalleProductoPage.validarBotonRemoveVisible();
    await detalleProductoPage.clickBackToProducts();
    await inventarioPage.validarInventarioCargado();
  });

  // ─────────────────────────────────────────────────────
  // CP-016 — Continue Shopping mantiene carrito
  // ─────────────────────────────────────────────────────
  test('CP-016 - Continue Shopping mantiene productos en carrito', async ({ autenticado: _autenticado, inventarioPage, carritoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
    await carritoPage.continuarComprando();
    await carritoPage.validarRegresaAlInventario();
    await inventarioPage.irAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-017 — Cancel en checkout regresa al carrito
  // ─────────────────────────────────────────────────────
  test('CP-017 - Cancel en checkout regresa al carrito con productos', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.clickCancelar();
    await checkoutPage.validarRegresaAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-018 — Cancel en resumen regresa al inventario
  // ─────────────────────────────────────────────────────
  test('CP-018 - Cancel en resumen regresa al inventario', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.valido.nombre,
      datosCheckout.valido.apellido,
      datosCheckout.valido.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarResumenCargado();
    await checkoutPage.clickCancelarResumen();
    await checkoutPage.validarRegresaAlInventario();
  });

  // ─────────────────────────────────────────────────────
  // CP-019 — Remover producto desde el carrito
  // ─────────────────────────────────────────────────────
  test('CP-019 - Remover producto desde el carrito', async ({ autenticado: _autenticado, inventarioPage, carritoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.agregarProducto(productos.bikeLight.nombre);
    await inventarioPage.validarContadorCarrito('2');
    await inventarioPage.irAlCarrito();

    await carritoPage.validarCantidadProductos(2);

    await carritoPage.removerProducto(productos.backpack.nombre);
    await carritoPage.validarCantidadProductos(1);

    await carritoPage.removerProducto(productos.bikeLight.nombre);
    await carritoPage.validarCarritoVacio();
  });

  // ─────────────────────────────────────────────────────
  // CP-020 — Checkout sin nombre pero con apellido y zip
  // ─────────────────────────────────────────────────────
  test('CP-020 - Checkout sin nombre pero con apellido y zip', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.soloApellido.nombre,
      datosCheckout.soloApellido.apellido,
      datosCheckout.soloApellido.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.validarMensajeError('First Name is required');
    await checkoutPage.validarPermanenceEnFormulario();
  });

  // ─────────────────────────────────────────────────────
  // CP-021 — Back Home regresa al inventario con carrito vacío
  // ─────────────────────────────────────────────────────
  test('CP-021 - Back Home regresa al inventario con carrito vacio', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage, confirmacionPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.llenarFormulario(
      datosCheckout.valido.nombre,
      datosCheckout.valido.apellido,
      datosCheckout.valido.cp
    );
    await checkoutPage.clickContinuar();
    await checkoutPage.clickFinish();
    await confirmacionPage.validarConfirmacionCompleta();

    await confirmacionPage.clickBackHome();
    await confirmacionPage.validarRegresaAlInventario();

    await inventarioPage.validarContadorDesaparecio();
  });

});
