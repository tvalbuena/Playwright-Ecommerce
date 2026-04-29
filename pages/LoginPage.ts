import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // 🔹 Locators
  readonly campoUsuario: Locator;
  readonly campoPassword: Locator;
  readonly botonLogin: Locator;
  readonly mensajeError: Locator;
  readonly botonCerrarError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.campoUsuario    = page.locator('#user-name');
    this.campoPassword   = page.locator('#password');
    this.botonLogin      = page.locator('#login-button');
    this.mensajeError    = page.getByTestId('error');
    this.botonCerrarError = page.getByTestId('error-button');
  }
    //MÉTODOS
  // 🔹 Navegación
  async navegar() {
    await this.page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }

  // 🔹 Login completo
  async login(usuario: string, password: string) {
    await this.campoUsuario.fill(usuario);
    await this.campoPassword.fill(password);
    await this.botonLogin.click();
  }

  // 🔹 Validar login exitoso
  async validarLoginExitoso() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  // 🔹 Validar mensaje de error
  async validarMensajeError(mensajeEsperado: string) {
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toContainText(mensajeEsperado);
  }

  // 🔹 Validar que permanece en login
  async validarPermanenceEnLogin() {
    await expect(this.page).toHaveURL(/\/$/);
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