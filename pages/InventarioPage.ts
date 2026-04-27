import { Page, Locator, expect } from '@playwright/test';

export class InventarioPage {
  readonly page: Page;

  readonly contenedorInventario: Locator;
  readonly iconoCarrito: Locator;
  readonly contadorCarrito: Locator;

  // 🔹 Menú hamburguesa
  readonly botonMenu: Locator;
  readonly botonCerrarMenu: Locator;
  readonly menuLateral: Locator;
  readonly enlaceAllItems: Locator;
  readonly enlaceLogout: Locator;
  readonly enlaceResetAppState: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contenedorInventario = page.getByTestId('inventory-container');
    this.iconoCarrito         = page.getByTestId('shopping-cart-link');
    this.contadorCarrito      = page.locator('.shopping_cart_badge');

    this.botonMenu           = page.locator('#react-burger-menu-btn');
    this.botonCerrarMenu     = page.locator('#react-burger-cross-btn');
    this.menuLateral         = page.locator('.bm-menu-wrap');
    this.enlaceAllItems      = page.locator('#inventory_sidebar_link');
    this.enlaceLogout        = page.locator('#logout_sidebar_link');
    this.enlaceResetAppState = page.locator('#reset_sidebar_link');
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

  async clickNombreProducto(nombre: string) {
    await this.page.locator('.inventory_item_name').getByText(nombre).click();
  }

  async seleccionarFiltro(opcion: string) {
    await this.page.locator('.product_sort_container').selectOption({ label: opcion });
  }

  async obtenerPrimerNombreProducto(): Promise<string> {
    return (await this.page.locator('.inventory_item_name').first().textContent()) || '';
  }

  async obtenerUltimoNombreProducto(): Promise<string> {
    return (await this.page.locator('.inventory_item_name').last().textContent()) || '';
  }

  async obtenerPrimerPrecioProducto(): Promise<string> {
    return (await this.page.locator('.inventory_item_price').first().textContent()) || '';
  }

  async obtenerUltimoPrecioProducto(): Promise<string> {
    return (await this.page.locator('.inventory_item_price').last().textContent()) || '';
  }

  // 🔹 Menú hamburguesa
  async abrirMenu() {
    await this.botonMenu.click();
  }

  async cerrarMenu() {
    await this.botonCerrarMenu.click();
  }

  async clickAllItems() {
    await this.enlaceAllItems.click();
  }

  async clickLogout() {
    await this.enlaceLogout.click();
  }

  async clickResetAppState() {
    await this.enlaceResetAppState.click();
  }

  async validarMenuVisible() {
    await expect(this.menuLateral).toHaveAttribute('aria-hidden', 'false');
  }

  async validarMenuOculto() {
    await expect(this.menuLateral).toHaveAttribute('aria-hidden', 'true');
  }
}
