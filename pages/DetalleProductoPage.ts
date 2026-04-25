import { Page, Locator, expect } from '@playwright/test';

export class DetalleProductoPage {
  readonly page: Page;

  // 🔹 Locators
  readonly nombreProducto: Locator;
  readonly precioProducto: Locator;
  readonly descripcionProducto: Locator;
  readonly botonAddToCart: Locator;
  readonly botonRemove: Locator;
  readonly botonBackToProducts: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nombreProducto      = page.locator('.inventory_details_name');
    this.precioProducto      = page.locator('.inventory_details_price');
    this.descripcionProducto = page.locator('.inventory_details_desc');
    this.botonAddToCart      = page.locator('[data-test^="add-to-cart"]');
    this.botonRemove         = page.getByTestId('remove');
    this.botonBackToProducts = page.getByTestId('back-to-products');
  }

  // 🔹 Validar URL de detalle
  async validarURLDetalle() {
    await expect(this.page).toHaveURL(/inventory-item\.html/);
  }

  // 🔹 Validar nombre del producto
  async validarNombreProducto(nombre: string) {
    await expect(this.nombreProducto).toHaveText(nombre);
  }

  // 🔹 Validar precio del producto
  async validarPrecioProducto(precio: string) {
    await expect(this.precioProducto).toHaveText(precio);
  }

  // 🔹 Validar botón Add to cart visible
  async validarBotonAddToCartVisible() {
    await expect(this.botonAddToCart).toBeVisible();
  }

  // 🔹 Validar botón Remove visible
  async validarBotonRemoveVisible() {
    await expect(this.botonRemove).toBeVisible();
  }

  // 🔹 Clic en Add to cart
  async clickAddToCart() {
    await this.botonAddToCart.click();
  }

  // 🔹 Clic en Remove
  async clickRemove() {
    await this.botonRemove.click();
  }

  // 🔹 Clic en Back to products
  async clickBackToProducts() {
    await this.botonBackToProducts.click();
  }
}
