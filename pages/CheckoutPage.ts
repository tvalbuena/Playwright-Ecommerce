import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // 🔹 Locators — Formulario
  readonly campoNombre: Locator;
  readonly campoApellido: Locator;
  readonly campoCp: Locator;
  readonly botonContinuar: Locator;
  readonly botonCancelar: Locator;
  readonly mensajeError: Locator;
  readonly botonCerrarError: Locator;

  // 🔹 Locators — Resumen
  readonly subtotal: Locator;
  readonly impuesto: Locator;
  readonly total: Locator;
  readonly botonFinish: Locator;
  readonly botonCancelarResumen: Locator;

  constructor(page: Page) {
    this.page = page;

    // 🔹 Formulario
    this.campoNombre    = page.getByTestId('firstName');
    this.campoApellido  = page.getByTestId('lastName');
    this.campoCp        = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.botonCancelar    = page.locator('[data-test="cancel"]').nth(0);
    this.mensajeError     = page.getByTestId('error');
    this.botonCerrarError = page.getByTestId('error-button');

    // 🔹 Resumen
    this.subtotal            = page.getByTestId('subtotal-label');
    this.impuesto            = page.getByTestId('tax-label');
    this.total               = page.getByTestId('total-label');
    this.botonFinish         = page.getByTestId('finish');
    this.botonCancelarResumen = page.locator('[data-test="cancel"]').first();
  }

  // 🔹 Validar que el formulario cargó
  async validarFormularioCargado() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  // 🔹 Llenar formulario
  async llenarFormulario(nombre: string, apellido: string, cp: string) {
    await this.campoNombre.fill(nombre);
    await this.campoApellido.fill(apellido);
    await this.campoCp.fill(cp);
  }

  // 🔹 Clic en continuar
  async clickContinuar() {
    await this.botonContinuar.click();
  }

  // 🔹 Clic en cancelar desde formulario
  async clickCancelar() {
    await this.botonCancelar.click();
  }

  // 🔹 Validar mensaje de error
  async validarMensajeError(mensajeEsperado: string) {
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toContainText(mensajeEsperado);
  }

  // 🔹 Validar que cargó el resumen
  async validarResumenCargado() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  // 🔹 Validar que el resumen muestra subtotal, impuesto y total
  async validarResumenVisible() {
    await expect(this.subtotal).toBeVisible();
    await expect(this.impuesto).toBeVisible();
    await expect(this.total).toBeVisible();
  }
  // 🔹 Validar que un producto aparece en el resumen
  async validarProductoEnResumen(nombreProducto: string) {
    await expect(this.page.getByText(nombreProducto)).toBeVisible();
  }

  // 🔹 Obtener subtotal
  async obtenerSubtotal(): Promise<string> {
    return await this.subtotal.textContent() || '';
  }

  // 🔹 Obtener impuesto
  async obtenerImpuesto(): Promise<string> {
    return await this.impuesto.textContent() || '';
  }

  // 🔹 Validar total es aproximadamente correcto
  async validarTotalAproximado(totalEsperado: string) {
    await expect(this.total).toContainText(totalEsperado);
  }

  // 🔹 Validar subtotal es correcto
  async validarSubtotalAproximado(subtotalEsperado: string) {
    await expect(this.subtotal).toContainText(subtotalEsperado);
  }

  // 🔹 Clic en Finish
  async clickFinish() {
    await this.botonFinish.click();
  }

  // 🔹 Clic en cancelar desde resumen
  async clickCancelarResumen() {
    await this.botonCancelarResumen.click();
  }

  // 🔹 Validar que cancelar regresa al carrito
  async validarRegresaAlCarrito() {
    await expect(this.page).toHaveURL(/cart/);
  }

  // 🔹 Validar que cancelar desde resumen regresa al inventario
  async validarRegresaAlInventario() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  // 🔹 Validar que permanece en el formulario
  async validarPermanenceEnFormulario() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  // 🔹 Navegar al detalle desde el resumen
  async clickNombreProductoEnResumen(nombre: string) {
    await this.page.locator('.inventory_item_name').getByText(nombre).click();
  }

  // 🔹 Validar precio de producto en resumen
  async validarPrecioProductoEnResumen(nombreProducto: string, precioEsperado: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: nombreProducto });
    await expect(item.locator('.inventory_item_price')).toHaveText(precioEsperado);
  }

  // 🔹 Validar Payment Information
  async validarPaymentInfo(paymentInfoEsperada: string) {
    await expect(this.page.getByText(paymentInfoEsperada)).toBeVisible();
  }

  // 🔹 Validar Shipping Information
  async validarShippingInfo(shippingInfoEsperada: string) {
    await expect(this.page.getByText(shippingInfoEsperada)).toBeVisible();
  }

  // 🔹 Validar item total exacto
  async validarItemTotal(itemTotalEsperado: string) {
    await expect(this.subtotal).toHaveText(itemTotalEsperado);
  }

  // 🔹 Validar impuesto exacto
  async validarImpuesto(impuestoEsperado: string) {
    await expect(this.impuesto).toHaveText(impuestoEsperado);
  }

  // 🔹 Validar total exacto
  async validarTotal(totalEsperado: string) {
    await expect(this.total).toHaveText(totalEsperado);
  }

  // 🔹 Cerrar mensaje de error con botón X
  async clickCerrarError() {
    await this.botonCerrarError.click();
  }

  // 🔹 Validar que el mensaje de error desapareció
  async validarErrorDesaparecio() {
    await expect(this.mensajeError).not.toBeVisible();
  }
}