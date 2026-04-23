import { Page, Locator, expect } from '@playwright/test';

export class ConfirmacionPage {
  readonly page: Page;

  // 🔹 Locators
  readonly contenedorConfirmacion: Locator;
  readonly mensajeConfirmacion: Locator;
  readonly mensajeSecundario: Locator;
  readonly botonBackHome: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contenedorConfirmacion = page.getByTestId('checkout-complete-container');
    this.mensajeConfirmacion    = page.getByTestId('complete-header');
    this.mensajeSecundario      = page.getByTestId('complete-text');
    this.botonBackHome          = page.getByTestId('back-to-products');
  }

  // 🔹 Validar que la confirmación cargó
  async validarConfirmacionCargada() {
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  // 🔹 Validar mensaje principal
  async validarMensajePrincipal() {
    await expect(this.mensajeConfirmacion).toBeVisible();
    await expect(this.mensajeConfirmacion).toContainText('Thank you for your order');
  }

  // 🔹 Validar mensaje secundario
  async validarMensajeSecundario() {
    await expect(this.mensajeSecundario).toBeVisible();
  }

  // 🔹 Validar confirmación completa
  async validarConfirmacionCompleta() {
    await this.validarConfirmacionCargada();
    await this.validarMensajePrincipal();
    await this.validarMensajeSecundario();
  }

  // 🔹 Clic en Back Home
  async clickBackHome() {
    await this.botonBackHome.click();
  }

  // 🔹 Validar que regresó al inventario
  async validarRegresaAlInventario() {
    await expect(this.page).toHaveURL(/inventory/);
  }
}