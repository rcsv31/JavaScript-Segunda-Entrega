// Constructor para productos
function Producto(nombre, precio, stock) {
  this.nombre = nombre;
  this.precio = precio;
  this.stock = stock;
}

// Constructor para impuestos
function Impuesto(nombre, valor) {
  this.nombre = nombre;
  this.valor = valor;
}

// Productos y precios con stock
const productos = [
  new Producto("cluedo", 29.99, 13),
  new Producto("monopoly", 35.00, 20),
  new Producto("risk", 38.95, 3),
  new Producto("ajedrez", 9.99, 0)
];

// IVA según el país
const impuestos = [
  new Impuesto("españa", 0.21),
  new Impuesto("francia", 0.20),
  new Impuesto("portugal", 0.23),
  new Impuesto("italia", 0.22)
];

// Función para mostrar mensajes de alerta
function mostrarMensaje(mensaje) {
  alert(mensaje);
}

// Filtrar productos por stock disponible
function filtrarProductos(stockMinimo) {
  return productos.filter(producto => producto.stock > stockMinimo);
}

// Elegir producto
function seleccionarProducto() {
  let productoElegido;

  do {
    const nombreProducto = prompt("Elige un producto: cluedo, monopoly, risk o ajedrez").toLowerCase();
    const productosDisponibles = filtrarProductos(0);

    productoElegido = productos.find(producto => producto.nombre === nombreProducto);

    if (!productoElegido) {
      mostrarMensaje("Producto no válido o no disponible. Elige entre los productos disponibles.");
    } else if (productoElegido.stock === 0) {
      mostrarMensaje(`¡Lo sentimos! ${productoElegido.nombre} está agotado.`);
      productoElegido = null; // No seleccionar un producto agotado
    } else {
      mostrarMensaje(`Producto elegido: ${productoElegido.nombre}, Precio: ${productoElegido.precio} €, Stock disponible: ${productoElegido.stock} unidades`);
    }
  } while (!productoElegido);

  return productoElegido;
}

// Ingresar cantidad verificando el stock
function ingresarCantidad(productoElegido) {
  let cantidad;

  do {
    cantidad = prompt("Introduce la cantidad deseada");

    if (cantidad === null) {
      const confirmarCancelacion = confirm("¿Está seguro de que desea cancelar el pedido?");
      if (confirmarCancelacion) {
        mostrarMensaje("Pedido cancelado. Hasta luego.");
        return null; // Salir del programa si el usuario confirma la cancelación
      }
    } else {
      cantidad = parseInt(cantidad);

      if (isNaN(cantidad) || cantidad <= 0 || cantidad !== parseInt(cantidad)) {
        mostrarMensaje("La cantidad ingresada no es válida. Debe ser un número entero positivo.");
      } else if (cantidad > productoElegido.stock) {
        mostrarMensaje(`Cantidad no disponible. Actualmente en stock hay ${productoElegido.stock} unidades.`);
      }
    }
  } while (isNaN(cantidad) || cantidad <= 0 || cantidad !== parseInt(cantidad) || cantidad > productoElegido.stock);

  return cantidad;
}

// Calcular precio sin impuestos
function calcularPrecioSinImpuestos(producto, cantidad) {
  const precioSinImpuestos = producto.precio * cantidad;
  mostrarMensaje(`El precio sin impuestos es: ${precioSinImpuestos.toFixed(2)} €`);
  return precioSinImpuestos;
}

// Obtener IVA para un país
function obtenerIVA(pais) {
  const ivaObj = impuestos.find(function(impuesto) {
    return impuesto.nombre === pais.toLowerCase();
  });

  if (ivaObj) {
    return ivaObj.valor;
  } else {
    return null;
  }
}

// Seleccionar país y agregar si no está en la lista
function seleccionarPais() {
  let pais;
  let iva;

  do {
    pais = prompt("Introduce tu país: España, Francia, Portugal, Italia o introduce tu país").toLowerCase();
    iva = obtenerIVA(pais);

    if (iva === null) {
      const nuevoPais = confirm("El país no está en la lista. ¿Quieres añadirlo?");
      if (nuevoPais) {
        let nuevoValorIVA;
        do {
          nuevoValorIVA = parseFloat(prompt("Introduce el porcentaje de IVA para el nuevo país (ejemplo: 21%)"));

          if (isNaN(nuevoValorIVA) || nuevoValorIVA < 0 || nuevoValorIVA > 100) {
            mostrarMensaje("Porcentaje de IVA no válido. Introduce un número entre 0 y 100.");
          }
        } while (isNaN(nuevoValorIVA) || nuevoValorIVA < 0 || nuevoValorIVA > 100);

        impuestos.push(new Impuesto(pais, nuevoValorIVA / 100));
        iva = nuevoValorIVA / 100;
        mostrarMensaje(`Se ha añadido el nuevo país ${pais} con un ${nuevoValorIVA}% de IVA.`);
      } else {
        mostrarMensaje("País no válido. Elige uno de los países de la lista o introduce un nuevo país.");
      }
    } else {
      mostrarMensaje(`Se le aplicará un ${iva * 100}% de IVA.`);
    }
  } while (iva === null);

  return iva;
}

// Solicitar código de descuento
function solicitarCodigoDescuento() {
  return prompt("Introduce el código de descuento (Bienvenid@23 para 10% de descuento)");
}

// Calcular precio con impuestos y descuento
function calcularPrecioConDescuento(precioSinImpuestos, iva, codigoDescuento) {
  if (!isNaN(precioSinImpuestos) && !isNaN(iva)) {
    const precioConImpuestos = precioSinImpuestos * (1 + iva);

    if (codigoDescuento === "Bienvenid@23") {
      const descuento = precioSinImpuestos * 0.10;
      const precioConDescuento = precioSinImpuestos - descuento;
      const precioConDescuentoConImpuestos = precioConDescuento * (1 + iva);
      const ahorro = descuento.toFixed(2);
      mostrarMensaje(`¡Enhorabuena! Te has ahorrado ${ahorro} € (10% de descuento).`);
      mostrarMensaje(`El precio sin impuestos y descuento es: ${precioConDescuento.toFixed(2)} €.`);
      mostrarMensaje(`El precio con impuestos y descuento es: ${precioConDescuentoConImpuestos.toFixed(2)} €.`);
    } else {
      mostrarMensaje("Código de descuento incorrecto.");
      const tieneCodigoDescuento = confirm("¿Tiene algún código de descuento?");
      if (tieneCodigoDescuento) {
        const nuevoCodigoDescuento = prompt("Por favor, introduzca el código de descuento");
        calcularPrecioConDescuento(precioSinImpuestos, iva, nuevoCodigoDescuento);
      } else {
        mostrarMensaje(`El precio con impuestos es: ${precioConImpuestos.toFixed(2)} €.`);
      }
    }
  }
}

// Ejecutar el programa
const productoElegido = seleccionarProducto();

if (productoElegido) {
  const cantidad = ingresarCantidad(productoElegido);

  if (cantidad !== null) {
    const precioSinImpuestos = calcularPrecioSinImpuestos(productoElegido, cantidad);
    const iva = seleccionarPais();
    const codigoDescuento = solicitarCodigoDescuento();
    calcularPrecioConDescuento(precioSinImpuestos, iva, codigoDescuento);
  }
}

