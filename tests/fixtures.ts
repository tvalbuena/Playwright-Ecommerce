import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventarioPage } from '../pages/InventarioPage';
import { CarritoPage } from '../pages/CarritoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmacionPage } from '../pages/ConfirmacionPage';
import { DetalleProductoPage } from '../pages/DetalleProductoPage';
import { usuarios } from '../data/datosPrueba';

type Fixtures = {
  loginPage: LoginPage;
  inventarioPage: InventarioPage;
  carritoPage: CarritoPage;
  checkoutPage: CheckoutPage;
  confirmacionPage: ConfirmacionPage;
  detalleProductoPage: DetalleProductoPage;
  autenticado: void;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navegar();
    await use(loginPage);
  },
  inventarioPage: async ({ page }, use) => {
    await use(new InventarioPage(page));
  },
  carritoPage: async ({ page }, use) => {
    await use(new CarritoPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  confirmacionPage: async ({ page }, use) => {
    await use(new ConfirmacionPage(page));
  },
  detalleProductoPage: async ({ page }, use) => {
    await use(new DetalleProductoPage(page));
  },
  autenticado: async ({ loginPage }, use) => {
    await loginPage.login(usuarios.valido.usuario, usuarios.valido.password);
    await use();
  },
});

export { expect } from '@playwright/test';
