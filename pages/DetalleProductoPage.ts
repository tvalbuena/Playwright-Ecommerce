import { Page, Locator, expect } from '@playwright/test';

export class DetalleProductoPage {
  private readonly page: Page;

  // 🔹 Locators
  private readonly nombreProducto: Locator;
  private readonly precioProducto: Locator;
  private readonly descripcionProducto: Locator;
  private readonly botonAddToCart: Locator;
  private readonly botonRemove: Locator;
  private readonly botonBackToProducts: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nombreProducto      = page.getByTestId('inventory-item-name');
    this.precioProducto      = page.getByTestId('inventory-item-price');
    this.descripcionProducto = page.getByTestId('inventory-item-desc');
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
