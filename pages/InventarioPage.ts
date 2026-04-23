import { Page, Locator, expect } from '@playwright/test';

export class InventarioPage {
  readonly page: Page;

  readonly contenedorInventario: Locator;
  readonly iconoCarrito: Locator;
  readonly contadorCarrito: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contenedorInventario = page.getByTestId('inventory-container');
    this.iconoCarrito         = page.getByTestId('shopping-cart-link');
    this.contadorCarrito      = page.locator('.shopping_cart_badge');
  }

  private slug(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-');
  }

  async validarInventarioCargado() {
    await expect(this.contenedorInventario).toBeVisible();
  }

  async agregarProducto(nombre: string) {
    await this.page.getByTestId(`add-to-cart-${this.slug(nombre)}`).click();
  }

  async removerProducto(nombre: string) {
    await this.page.getByTestId(`remove-${this.slug(nombre)}`).click();
  }

  async validarContadorCarrito(numeroEsperado: string) {
    await expect(this.contadorCarrito).toHaveText(numeroEsperado);
  }

  async validarContadorDesaparecio() {
    await expect(this.contadorCarrito).not.toBeVisible();
  }

  async validarBotonRemoverVisible(nombre: string) {
    await expect(this.page.getByTestId(`remove-${this.slug(nombre)}`)).toBeVisible();
  }

  async validarBotonAgregarVisible(nombre: string) {
    await expect(this.page.getByTestId(`add-to-cart-${this.slug(nombre)}`)).toBeVisible();
  }

  async irAlCarrito() {
    await this.iconoCarrito.click();
  }
}
