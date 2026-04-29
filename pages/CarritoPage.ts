import { Page, Locator, expect } from '@playwright/test';

export class CarritoPage {
  readonly page: Page;

  readonly botonContinuarComprando: Locator;
  readonly botonCheckout: Locator;

  constructor(page: Page) {
    this.page = page;

    this.botonContinuarComprando = page.getByTestId('continue-shopping');
    this.botonCheckout           = page.getByTestId('checkout');
  }

  private slug(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-');
  }

  async validarCarritoCargado() {
    await expect(this.page).toHaveURL(/cart/);
  }

  async validarProductoEnCarrito(nombreProducto: string) {
    await expect(this.page.getByText(nombreProducto)).toBeVisible();
  }

  async validarCantidadProductos(cantidad: number) {
    const items = this.page.locator('.cart_item');
    await expect(items).toHaveCount(cantidad);
  }

  async continuarComprando() {
    await this.botonContinuarComprando.click();
  }

  async irAlCheckout() {
    await this.botonCheckout.click();
  }

  async removerProducto(nombre: string) {
    await this.page.getByTestId(`remove-${this.slug(nombre)}`).click();
  }

  async validarCarritoVacio() {
    const items = this.page.locator('.cart_item');
    await expect(items).toHaveCount(0);
  }

  async validarRegresaAlInventario() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  async clickNombreProducto(nombre: string) {
    await this.page.locator('.inventory_item_name').getByText(nombre).click();
  }

  async validarPrecioProducto(nombreProducto: string, precioEsperado: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: nombreProducto });
    await expect(item.locator('.inventory_item_price')).toHaveText(precioEsperado);
  }

  async validarCarritoVacioVisible() {
    const items = this.page.locator('.cart_item');
    await expect(items).toHaveCount(0);
  }

  async validarBotonCheckoutVisible() {
    await expect(this.botonCheckout).toBeVisible();
  }
}
