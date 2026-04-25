// 🔹 Datos de prueba centralizados — Sauce Demo

export const usuarios = {
  valido: {
    usuario:  'standard_user',
    password: 'secret_sauce'
  },
  bloqueado: {
    usuario:  'locked_out_user',
    password: 'secret_sauce'
  },
  inexistente: {
    usuario:  'usuario_falso',
    password: 'secret_sauce'
  }
};

export const datosCheckout = {
  valido: {
    nombre:   'Tatiana',
    apellido: 'Mora',
    cp:       '110111'
  },
  sinNombre: {
    nombre:   '',
    apellido: 'Mora',
    cp:       '110111'
  },
  sinApellido: {
    nombre:   'Tatiana',
    apellido: '',
    cp:       '110111'
  },
  sinCp: {
    nombre:   'Tatiana',
    apellido: 'Mora',
    cp:       ''
  },
  // ✅ NUEVO — CP-017
  soloApellido: {
    nombre:   '',
    apellido: 'Mora',
    cp:       '110111'
  }
};

export const productos = {
  backpack: {
    nombre: 'Sauce Labs Backpack',
    precio: '$29.99'
  },
  bikeLight: {
    nombre: 'Sauce Labs Bike Light',
    precio: '$9.99'
  }
};

export const ordenamiento = {
  nombreAZ: {
    opcion:       'Name (A to Z)',
    primerNombre: 'Sauce Labs Backpack',
    ultimoNombre: 'Test.allTheThings() T-Shirt (Red)'
  },
  nombreZA: {
    opcion:       'Name (Z to A)',
    primerNombre: 'Test.allTheThings() T-Shirt (Red)',
    ultimoNombre: 'Sauce Labs Backpack'
  },
  precioAscendente: {
    opcion:        'Price (low to high)',
    primerPrecio:  '$7.99',
    ultimoPrecio:  '$49.99'
  },
  precioDescendente: {
    opcion:        'Price (high to low)',
    primerPrecio:  '$49.99',
    ultimoPrecio:  '$7.99'
  }
};

export const resumenPedido = {
  paymentInfo:  'SauceCard #31337',
  shippingInfo: 'Free Pony Express Delivery!',
  tax:          'Tax: $3.20',
  itemTotal:    'Item total: $39.98',
  total:        'Total: $43.18'
};