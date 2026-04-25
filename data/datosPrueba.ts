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

export const resumenPedido = {
  paymentInfo:  'SauceCard #31337',
  shippingInfo: 'Free Pony Express Delivery!',
  tax:          'Tax: $3.20',
  itemTotal:    'Item total: $39.98',
  total:        'Total: $43.18'
};