# Playwright-Ecommerce — Automatización E2E Sauce Demo

[![Playwright Tests](https://github.com/tvalbuena/Playwright-Ecommerce/actions/workflows/playwright.yml/badge.svg)](https://github.com/tvalbuena/Playwright-Ecommerce/actions/workflows/playwright.yml)

Proyecto de automatización de pruebas end-to-end sobre [Sauce Demo](https://www.saucedemo.com), una aplicación e-commerce de práctica. Cubre el flujo completo de compra — desde el login hasta la confirmación del pedido — aplicando el patrón **Page Object Model**, datos de prueba centralizados y un pipeline de **CI/CD** con GitHub Actions.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Playwright](https://playwright.dev/) | Framework de automatización E2E |
| [TypeScript](https://www.typescriptlang.org/) | Lenguaje tipado para mayor robustez |
| [Page Object Model](https://playwright.dev/docs/pom) | Patrón de diseño para mantenibilidad |
| [GitHub Actions](https://github.com/features/actions) | Pipeline CI/CD — ejecución automática en push/PR |
| [Node.js](https://nodejs.org/) | Entorno de ejecución |

---

## Estructura del proyecto

```
Playwright-Ecommerce/
├── .github/
│   └── workflows/
│       └── playwright.yml       # Pipeline CI/CD: instala, ejecuta y sube reporte
├── data/
│   └── datosPrueba.ts           # Datos de prueba centralizados (usuarios, productos,
│                                #   datos de checkout, ordenamiento, mensajes de error)
├── docs/
│   └── BUG_REPORT.md            # Reporte profesional de bugs con evidencia automatizada
├── pages/
│   ├── LoginPage.ts             # POM — Pantalla de login
│   ├── InventarioPage.ts        # POM — Catálogo de productos y menú hamburguesa
│   ├── DetalleProductoPage.ts   # POM — Detalle individual de producto
│   ├── CarritoPage.ts           # POM — Carrito de compras
│   ├── CheckoutPage.ts          # POM — Formulario de datos, resumen y pago
│   └── ConfirmacionPage.ts      # POM — Pantalla de confirmación del pedido
├── tests/
│   ├── fixtures.ts              # Fixtures de Playwright con POM y fixture `autenticado`
│   └── compraSaucedemo.spec.ts  # Suite principal — 36 casos de prueba E2E
├── playwright.config.ts         # Configuración: browsers, baseURL, reporters, retries
├── package.json                 # Scripts y dependencias
└── tsconfig.json                # Configuración de TypeScript
```

### Decisiones de diseño

- **`data/datosPrueba.ts`** — Todos los valores de prueba están centralizados. Un cambio de credencial o precio se aplica en un solo lugar y se propaga a toda la suite.
- **`tests/fixtures.ts`** — Extiende el `test` de Playwright para inyectar automáticamente los Page Objects y el fixture `autenticado`, que maneja el login antes de cada test que lo requiere.
- **Page Objects** — Cada pantalla de la aplicación tiene su propia clase con locators y métodos, desacoplando la lógica de interacción de los tests.

---

## Ejecución local

### Requisitos previos

```bash
node -v   # v18 o superior recomendado
npm -v
```

### Instalación

```bash
npm install
npx playwright install
```

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta todos los tests en los 3 browsers (headless) |
| `npm run test:headed` | Ejecuta los tests con el browser visible |
| `npm run test:ui` | Abre el modo interactivo UI de Playwright |
| `npm run test:debug` | Ejecuta en modo debug con Playwright Inspector |
| `npm run report` | Abre el reporte HTML del último ciclo de ejecución |

### Ejecutar un test específico

```bash
# Por nombre de test
npx playwright test -g "CP-010"

# Por archivo
npx playwright test tests/compraSaucedemo.spec.ts

# Solo en un browser
npx playwright test --project=chromium
```

---

## Cobertura de pruebas — 36 casos de prueba

### Autenticación (7 tests)

| CP | Descripción |
|----|-------------|
| CP-001 | Login exitoso con usuario válido |
| CP-002 | Login con usuario bloqueado |
| CP-003 | Login con usuario inexistente |
| CP-004 | Login con ambos campos vacíos |
| CP-005 | Login solo con contraseña sin usuario |
| CP-006 | Login solo con usuario sin contraseña |
| CP-035 | Cerrar mensaje de error en login con botón X |

### Inventario — Catálogo y detalle (7 tests)

| CP | Descripción |
|----|-------------|
| CP-007 | Agregar y remover producto desde catálogo |
| CP-008 | Navegar al detalle del producto sin agregar al carrito |
| CP-009 | Navegar al detalle del producto ya agregado al carrito |
| CP-022 | Ordenar productos por nombre A to Z |
| CP-023 | Ordenar productos por nombre Z to A |
| CP-024 | Ordenar productos por precio de menor a mayor |
| CP-025 | Ordenar productos por precio de mayor a menor |

### Menú hamburguesa (4 tests)

| CP | Descripción |
|----|-------------|
| CP-026 | Abrir y cerrar menú hamburguesa |
| CP-027 | Logout desde el menú hamburguesa cierra la sesión |
| CP-028 | All Items desde el menú regresa al inventario |
| CP-029 | Reset App State limpia el carrito y restaura botones |

### Carrito (6 tests)

| CP | Descripción |
|----|-------------|
| CP-014 | Carrito navega al detalle del producto |
| CP-016 | Continue Shopping mantiene productos en carrito |
| CP-017 | Cancel en checkout regresa al carrito con productos |
| CP-019 | Remover producto desde el carrito |
| CP-033 | Carrito vacío muestra estado correcto |
| CP-034 | Checkout con carrito vacío *(bug documentado)* |

### Checkout y compra (9 tests)

| CP | Descripción |
|----|-------------|
| CP-010 | Compra E2E completa de punta a punta |
| CP-011 | Checkout con todos los campos vacíos |
| CP-012 | Checkout sin apellido |
| CP-013 | Checkout sin zip code |
| CP-015 | Resumen navega al detalle del producto |
| CP-018 | Cancel en resumen de pedido regresa al inventario |
| CP-020 | Checkout sin nombre pero con apellido y zip |
| CP-021 | Back Home regresa al inventario con carrito vacío |
| CP-036 | Cerrar mensaje de error en checkout con botón X |

### Seguridad — Protección de rutas (3 tests)

| CP | Descripción |
|----|-------------|
| CP-030 | Acceder a inventario sin autenticación redirige al login |
| CP-031 | Acceder al carrito sin autenticación redirige al login |
| CP-032 | Acceder al checkout sin autenticación redirige al login |

---

## Bugs conocidos documentados

El proyecto incluye tests que documentan y cubren bugs conocidos de la aplicación. Estos tests **pasan intencionalmente** para dejar constancia del comportamiento actual y actuar como regresión cuando sean corregidos.

### Bug #1 — Reset App State no actualiza el botón del producto

> **CP que lo cubre:** CP-029

| | |
|---|---|
| **Pantalla** | Inventario |
| **Acción** | Agregar producto → menú → Reset App State |
| **Esperado** | Contador desaparece **y** botón vuelve a *Add to cart* |
| **Real** | Contador desaparece pero el botón sigue en *Remove* |
| **Severidad** | Media |

### Bug #2 — Sauce Demo permite completar una compra con el carrito vacío

> **CP que lo cubre:** CP-034

| | |
|---|---|
| **Pantalla** | Carrito → Checkout |
| **Acción** | Ir al carrito vacío → Checkout → completar formulario → Finish |
| **Esperado** | El sistema bloquea el checkout sin productos |
| **Real** | La compra se completa con total $0.00 y sin productos |
| **Severidad** | Alta |


---

## CI/CD — GitHub Actions

El pipeline se ejecuta automáticamente en cada **push** y **pull request** a la rama `main`.

```
push / PR → instalar dependencias → instalar browsers → ejecutar tests → subir reporte HTML
```

- Configurado con **1 worker** en CI para ejecución secuencial estable.
- **2 reintentos** automáticos en caso de fallo en CI.
- El reporte HTML se sube como artefacto con retención de **30 días**.
- Los browsers utilizados son **Chromium**, **Firefox** y **WebKit** (Safari).

---

## Autor

**Tatiana Alexandra Mora Valbuena**  
QA Automation Engineer  
[GitHub](https://github.com/tvalbuena)
