import { test } from './fixtures';
import { usuarios, datosCheckout, productos } from '../data/datosPrueba';

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
  // CP-008 — Compra E2E completa
  // ─────────────────────────────────────────────────────
  test('CP-008 - Compra E2E completa de punta a punta', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage, confirmacionPage }) => {
    // Inventario — agregar productos
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.agregarProducto(productos.bikeLight.nombre);
    await inventarioPage.validarContadorCarrito('2');
    await inventarioPage.irAlCarrito();

    // Carrito — validar productos
    await carritoPage.validarCarritoCargado();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
    await carritoPage.validarProductoEnCarrito(productos.bikeLight.nombre);
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
    await checkoutPage.validarResumenVisible();

    // Resumen — validar precios (Backpack: $29.99 + Bike Light: $9.99 = $39.98 + Tax ~$3.20)
    await checkoutPage.validarSubtotalAproximado('39.98');
    await checkoutPage.validarTotalAproximado('43.1');

    await checkoutPage.clickFinish();

    // Confirmacion
    await confirmacionPage.validarConfirmacionCompleta();
  });

  // ─────────────────────────────────────────────────────
  // CP-009 — Checkout todos los campos vacios
  // ─────────────────────────────────────────────────────
  test('CP-009 - Checkout con todos los campos vacios', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
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
  // CP-010 — Checkout sin apellido
  // ─────────────────────────────────────────────────────
  test('CP-010 - Checkout sin apellido', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
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
  // CP-011 — Checkout sin zip code
  // ─────────────────────────────────────────────────────
  test('CP-011 - Checkout sin zip code', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
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
  // CP-013 — Continue Shopping mantiene carrito
  // ─────────────────────────────────────────────────────
  test('CP-013 - Continue Shopping mantiene productos en carrito', async ({ autenticado: _autenticado, inventarioPage, carritoPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
    await carritoPage.continuarComprando();
    await carritoPage.validarRegresaAlInventario();
    await inventarioPage.irAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-014 — Cancel en checkout regresa al carrito
  // ─────────────────────────────────────────────────────
  test('CP-014 - Cancel en checkout regresa al carrito con productos', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
    await inventarioPage.agregarProducto(productos.backpack.nombre);
    await inventarioPage.irAlCarrito();
    await carritoPage.irAlCheckout();
    await checkoutPage.clickCancelar();
    await checkoutPage.validarRegresaAlCarrito();
    await carritoPage.validarProductoEnCarrito(productos.backpack.nombre);
  });

  // ─────────────────────────────────────────────────────
  // CP-015 — Cancel en resumen regresa al inventario
  // ─────────────────────────────────────────────────────
  test('CP-015 - Cancel en resumen regresa al inventario', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
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
  // CP-016 — Remover producto desde el carrito
  // ─────────────────────────────────────────────────────
  test('CP-016 - Remover producto desde el carrito', async ({ autenticado: _autenticado, inventarioPage, carritoPage }) => {
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
  // CP-017 — Checkout sin nombre pero con apellido y zip
  // ─────────────────────────────────────────────────────
  test('CP-017 - Checkout sin nombre pero con apellido y zip', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage }) => {
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
  // CP-018 — Back Home regresa al inventario con carrito vacío
  // ─────────────────────────────────────────────────────
  test('CP-018 - Back Home regresa al inventario con carrito vacio', async ({ autenticado: _autenticado, inventarioPage, carritoPage, checkoutPage, confirmacionPage }) => {
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
