var coin = 99999999999999;
var casasPosiciones = [];
var pastoRocaPosiciones = [];
var tiempo = 1;
var aumentoPrecio = 1.3;
var produccionPorMinuto = {};

generarPastoRoca();

var tiposDeDefensas = [
  {
    nombre: "Flecheros",
    id: "1",
    precio: 50, // Aumentado el precio
    produccion: 2, // Reducida la producción
    tiempo: 10, // 1 cada 1 segundo
  },
  {
    nombre: "Guerreros",
    id: "2",
    precio: 500, // Aumentado el precio
    produccion: 5, // Reducida la producción
    tiempo: 10, // 5 cada 1 segundo
  },
];
var tiposDeMejoras = [
  {
    nombre: "Generacion",
    id: "1",
    precio: 50, // Aumentado el precio
    produccion: 2, // Reducida la producción
    tiempo: 10, // 1 cada 1 segundo
  },
  {
    nombre: "Daño",
    id: "2",
    precio: 500, // Aumentado el precio
    produccion: 5, // Reducida la producción
    tiempo: 10, // 5 cada 1 segundo
  },
];
var tiposDeCasas = [
  {
    nombre: "Cabaña",
    id: "c-1",
    precio: 50, // Aumentado el precio
    produccion: 2, // Reducida la producción
    tiempo: 10, // 1 cada 1 segundo
  },
  {
    nombre: "Casa de Campo",
    id: "c-2",
    precio: 500, // Aumentado el precio
    produccion: 5, // Reducida la producción
    tiempo: 10, // 5 cada 1 segundo
  },
  {
    nombre: "Torre de Piedra",
    id: "c-3",
    precio: 2000, // Aumentado el precio
    produccion: 30, // Reducida la producción
    tiempo: 10,
  },
  {
    nombre: "Castillo",
    id: "c-4",
    precio: 14000, // Aumentado el precio
    produccion: 500, // Reducida la producción
    tiempo: 10,
  },
  {
    nombre: "Palacio Real",
    id: "c-5",
    precio: 60000, // Aumentado el precio
    produccion: 5000, // Reducida la producción
    tiempo: 10,
  },
  {
    nombre: "Fabrica",
    id: "c-6",
    precio: 900000, // Aumentado el precio
    produccion: 80000, // Reducida la producción
    tiempo: 1,
  },
  {
    nombre: "Extractor de Petroleo",
    id: "c-6",
    precio: 900000, // Aumentado el precio
    produccion: 80000, // Reducida la producción
    tiempo: 1,
  },
  {
    nombre: "Planta Nuclear",
    id: "c-6",
    precio: 900000, // Aumentado el precio
    produccion: 80000, // Reducida la producción
    tiempo: 1,
  },
  {
    nombre: "Generador Cuantico",
    id: "c-6",
    precio: 900000, // Aumentado el precio
    produccion: 80000, // Reducida la producción
    tiempo: 1,
  },
];

function clicker() {
  var genclick = 1;
  genclick = parseInt(genclick * tiempo);
  coin += genclick;
  $(".coinCounter").text(coin);
  $(".mineral-centro").css({
    transform: "scale(1.02)",
  });
  setTimeout(function () {
    $(".mineral-centro").css({
      transform: "scale(1)",
    });
  }, 100);
  var x = 1270;
  var y = 1210;

  mostrarNumeroProduccion(genclick, x, y);
}

function mostrarNumeroProduccion(produccion, x, y) {
  var number = $(
    "<div class='plus-one bg-dark px-2 rounded-pill'>+" +
      produccion +
      "<img src='./assets/img/coin.png' style='width: 22px; z-index: 10000;'></div>"
  );

  number.css({
    position: "absolute",
    top: y - 30,
    left: x + 5,
  });

  $("#casasContainer").append(number);

  // Animar el número antes de desaparecer
  number.animate({ top: "-=20", opacity: 0 }, 700, function () {
    number.remove();
  });
}
function sendLogs(logs) {
  if (logs != 0) {
    var divlogs = $(
      "<div class='bg-dark text-white px-2 my-2 rounded-pill'>" +  logs + "</div>"
    );
  
    $("#logs").append(divlogs);
  
    // Animar el número antes de desaparecer
    divlogs.animate({ top: "-=20", opacity: 0 }, 10000, function () {
      divlogs.remove();
    });
  }
}

function comprarCasa(indice) {
  if (indice < tiposDeCasas.length) {
    if (coin >= parseInt(tiposDeCasas[indice].precio)) {
      coin -= parseInt(tiposDeCasas[indice].precio);

      // Incrementar el precio para la próxima compra
      tiposDeCasas[indice].precio = tiposDeCasas[indice].precio * aumentoPrecio;

      var getprecio = $(".precioCasa[data-indice='" + indice + "']:first");
      var getcantidad = $(".cantidadCasa[data-indice='" + indice + "']:first");

      var precioElement = $(".precioCasa[data-indice='" + indice + "']");
      var cantidadElement = $(".cantidadCasa[data-indice='" + indice + "']");
            
      var cantidad = parseInt(getcantidad.text()) + 1;
      var precioActual = parseInt(getprecio.text()) || 0; // Obtiene el precio actual o establece 0 si es NaN
      var nuevoPrecio = parseInt(precioActual + tiposDeCasas[indice].precio);
      precioElement.empty().text(nuevoPrecio);
      cantidadElement.empty().text(cantidad);

      var centroX = 1270;
      var centroY = 1210;

      var posicionLibre = encontrarPosicionLibre(
        casasPosiciones,
        centroX,
        centroY
      );
      var x = posicionLibre.x;
      var y = posicionLibre.y;

      casasPosiciones.push({ x: x, y: y });

      var idGenerated = parseInt(Math.random() * (100000000 - 1) + 1);

      // Crear elemento de casa
      var vidaInicial = 100; // Puedes ajustar la vida inicial según tus necesidades
      var casaElement = $("<div class='casa " + tiposDeCasas[indice].id + "'>")
        .css({ position: "absolute", left: x + "px", top: y + "px" })
        .data("vida", vidaInicial) // Guardar la vida en los datos del elemento
        .appendTo("#casasContainer");
      casaElement.attr("id", "casa_" + idGenerated);
      var centroCasaX = x + casaElement.width() / 2;
      var centroCasaY = y + casaElement.height() / 2;
      // Añadir vida a la casa
      var vidaElement = $("<p class='vidaCasa text-white'>").text(
        "❤️: " + vidaInicial
      );
      var vidaElement = $("<p class='vidaCasa text-white'>")
        .text("❤️: " + vidaInicial)
        .css({
          position: "absolute",
          left: centroCasaX - vidaElement.width() / - 1500 + "px",
          top: centroCasaY + casaElement.height() / 2 + "px",
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "center",
          color: "white",
          zIndex: "1000000 !important",
        })
        .appendTo("#casasContainer");
        vidaElement.attr("id","vida_"+idGenerated);
      // Mostrar el cuadrado de la casa
      var casaSquare = $("#casaSquare");
      casaSquare.css({ left: x + "px", top: y + "px", display: "block" });
      
      setInterval(function(){
        actualizarProduccionPorMinuto(indice);
        actualizarVidaCasa(casaElement, vidaElement);
      },(1000 / tiempo));

      setInterval(function () {
        coin += tiposDeCasas[indice].produccion * tiempo;
        $(".coinCounter").text(coin);
        mostrarNumeroProduccion(tiposDeCasas[indice].produccion, x, y);
      }, (tiposDeCasas[indice].tiempo * 1000) / tiempo);
    }else{
      sendLogs('Saldo insuficiente');
    }
  }
}

function actualizarVidaCasa(casaElement, vidaElement) {
  // Obtener la vida actual de la casa
  var vidaActual = casaElement.data("vida");

  // Mostrar la vida actualizada
  vidaElement.text("❤️: " + vidaActual);

  // Guardar la vida actualizada en los datos del elemento
  casaElement.data("vida", vidaActual);

  // Verificar si la casa ha perdido toda su vida
  if (vidaActual <= 0 ) {
    // Realizar acciones cuando la casa pierde toda su vida (por ejemplo, eliminarla)
    // En este ejemplo, simplemente la ocultamos
    vidaElement.text("❤️: 0");
  }
}

function encontrarPosicionLibre(posicionesOcupadas, centroX, centroY) {
  var maxRadio = 400; // Radio máximo del círculo
  var intentos = 0;
  var maxIntentos = 10;
  while (intentos < maxIntentos) {
    // Genera coordenadas polares aleatorias dentro del círculo
    var radio = Math.random() * maxRadio;
    var angulo = Math.random() * 2 * Math.PI;

    // Convierte coordenadas polares a cartesianas
    var x = radio * Math.cos(angulo) + centroX;
    var y = radio * Math.sin(angulo) + centroY;

    var ocupada = posicionesOcupadas.some(function (pos) {
      // Verifica si la distancia es menor que un umbral
      var distancia = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );
      return distancia < 40;
    });

    if (!ocupada) {
      return { x: x, y: y };
    }

    intentos++;
  }

  return {
    x: centroX,
    y: centroY,
  };
}

function generator() {
  for (var i = 0; i < tiposDeCasas.length; i++) {
    var cantidad = obtenerCantidadCasas(tiposDeCasas[i].id);
    coin += Math.trunc(tiposDeCasas[i].produccion * cantidad * (tiempo / 60));
  }
  $(".coinCounter").text(parseInt(coin)); // Redondear a dos decimales
  setTimeout(generator, 1000);
}

// Llama a la función generator para iniciar la producción
generator();

function actualizarProduccionPorMinuto(indice) {
  var cantidad = obtenerCantidadCasas(tiposDeCasas[indice].id);
  var produccionPorMinutoTipo =
    (tiposDeCasas[indice].produccion * cantidad * 60) /
    tiposDeCasas[indice].tiempo;
  produccionPorMinuto[indice] = produccionPorMinutoTipo;

  // Actualizar la información en el div de casas
  $("#info-houses").empty();

  for (var i = 0; i < tiposDeCasas.length; i++) {
    if (produccionPorMinuto[i] > 0) {
      var infoHtml = `
            <div class="bg-dark text-white rounded-pill px-3 py-1 mt-2" style="font-size: 14px; opacity: 0.9;">
                <div style="opacity: 1 !important;">
                <span class="mb-0">${formatearNumero(
                  parseInt(produccionPorMinuto[i])
                )} / Minuto</span>
                <img src="./assets/img/${
                  tiposDeCasas[i].id
                }.png" alt="" style="width: 30px; margin-left: 10px;">
                </div>
            </div>
        `;
      $("#info-houses").append(infoHtml);
    }
  }
}

function obtenerCantidadCasas(nombreCasa) {
  return $(".casa." + nombreCasa).length;
}

function generarPastoRoca() {
  $("#pastoRocaContainer").empty();

  var cantidadPasto = 800;
  var cantidadRoca = 120;
  var cantidadArbolesG = 80;

  for (var i = 0; i < cantidadPasto; i++) {
    var x = Math.random() * 100 + "%";
    var y = Math.random() * 100 + "%";

    var elemento;

    // Aleatoriamente, elige entre 'pasto' y 'flower'
    if (Math.random() < 0.8) {
      elemento = $("<div class='element pasto'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    } else if (Math.random() < 0.3) {
      elemento = $("<div class='element arbol'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    } else {
      elemento = $("<div class='element flower'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    }

    $("#pastoRocaContainer").append(elemento);
  }

  // Genera las rocas
  for (var i = 0; i < cantidadRoca; i++) {
    var x = Math.random() * 100 + "%";
    var y = Math.random() * 100 + "%";

    if (Math.random() < 0.6) {
      rocaElement = $("<div class='element roca'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    } else {
      rocaElement = $("<div class='element mineral'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    }

    $("#pastoRocaContainer").append(rocaElement);
  }
  for (var i = 0; i < cantidadArbolesG; i++) {
    var x = Math.random() * 100 + "%";
    var y = Math.random() * 100 + "%";

    if (Math.random() < 0.5) {
      arbolesElement = $("<div class='element arbol1'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    } else {
      arbolesElement = $("<div class='element arbol2'>").css({
        position: "absolute",
        left: x,
        top: y,
      });
    }

    $("#pastoRocaContainer").append(arbolesElement);
  }
}

function formatearNumero(numero) {
  if (numero < 1000) {
    return numero.toString();
  }
  // Definir los sufijos para los números grandes
  var sufijos = [" K", " M", " B", " T"];

  // Encontrar el sufijo adecuado y dividir el número
  var sufijoIndex = 0;
  while (numero >= 1000 && sufijoIndex < sufijos.length - 1) {
    numero /= 1000;
    sufijoIndex++;
  }

  // Redondear a dos decimales si es necesario
  if (numero % 1 !== 0) {
    numero = numero.toFixed(2);
  }

  // Agregar el sufijo al número formateado
  var numeroFormateado = numero + sufijos[sufijoIndex];
  return numeroFormateado;
}
