var portales = [];
var monstruosPorPortal = 1;
var oleadasPasadas = 0;
var tiempoEntreOleadas = 5 * 60 * 1000; // 5 minutos
var tiempoRestanteEntreOleadas = tiempoEntreOleadas;
var danio = 10; // daño por click hacia los mounstros
var log = 0;
var ultimaCasaConocidaX = null;
var ultimaCasaConocidaY = null;

$("#oleadas_counter").text(oleadasPasadas);
var tiposDeMonstruos = [
  {
    nombre: "Duende",
    vida: 10,
    velocidad: 7,
    width: 50,
    height: 50,
    sprite: "url(./assets/img/enemys/2/D_Walk.png)",
  },
  {
    nombre: "Lobo",
    vida: 20,
    velocidad: 16,
    width: 50,
    height: 50,
    sprite: "url(./assets/img/enemys/3/D_Walk.png)",
  },
  {
    nombre: "Alfa",
    vida: 70,
    velocidad: 18,
    width: 60,
    height: 60,
    sprite: "url(./assets/img/enemys/3/D_Walk.png)",
  },
  {
    nombre: "Orco",
    vida: 100,
    velocidad: 7,
    width: 75,
    height: 75,
    sprite: "url(./assets/img/enemys/2/D_Walk.png)",
  },
  // Agrega más tipos de monstruos según tus necesidades
];
// Lógica para generar la oleada
function generarOleada() {
  generarPortal();
  $("#oleadas_counter").text(oleadasPasadas);
}
// Función para convertir milisegundos a formato de tiempo (MM:SS)
function convertirTiempo(milisegundos) {
  var segundos = Math.floor(milisegundos / 1000);
  var minutos = Math.floor(segundos / 60);
  segundos = segundos % 60;
  return minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
}

// Iniciar las oleadas cuando se presiona la tecla 'q'
$("#oleadas").on("click", function () {
  generarOleada();
});

iniciarOleadas();
// Función para iniciar las oleadas con un intervalo de tiempo
function iniciarOleadas() {
  setInterval(function () {
    tiempoRestanteEntreOleadas -= 1000;

    // Actualizar el tiempo restante en el elemento #time_oleada
    $("#time_oleada").text(convertirTiempo(tiempoRestanteEntreOleadas));

    // Si el tiempo restante llega a cero, generar una nueva oleada
    if (tiempoRestanteEntreOleadas <= 0) {
      generarOleada();
      tiempoRestanteEntreOleadas = tiempoEntreOleadas;
    }
  }, 1000);
}
// Función para generar un portal en los bordes del mapa
function generarPortal() {
  oleadasPasadas++;
  monstruosPorPortal *= 1.2;
  var x, y;

  // Elegir aleatoriamente entre los bordes superior/inferior y izquierdo/derecho
  if (Math.random() < 0.5) {
    // Bordes superior e inferior
    x = Math.random() * 1000; // Ajusta según el tamaño de tu mapa
    y = Math.random() < 0.5 ? 0 : 1000; // 0 para superior, 2600 para inferior
  } else {
    // Bordes izquierdo y derecho
    x = Math.random() < 0.5 ? 0 : 1000; // 0 para izquierdo, 2600 para derecho
    y = Math.random() * 1000; // Ajusta según el tamaño de tu mapa
  }
  log =
    "⚔️ Generando Oleada en Cordenadas X: " +
    parseInt(x) +
    " Y: " +
    parseInt(y) +
    "";
  sendLogs(log);
  // Crear el elemento del portal y agregarlo al contenedor del mapa
  var portalElement = $("<div class='portal'>").css({
    position: "absolute",
    left: x + "px",
    top: y + "px",
    width: "90px", // Ajusta según tus necesidades
    height: "90px", // Ajusta según tus necesidades
    backgroundColor: "transparent",
    zIndex: "10", // Ajusta según tus necesidades
  });
  $("#pastoRocaContainer").append(portalElement);
  portales.push({ x: x, y: y });
  generarMonstruo();
}

// Función para generar un monstruo
function generarMonstruo() {
  for (let i = 0; i < monstruosPorPortal; i++) {
    var tipoMonstruo =
      tiposDeMonstruos[Math.floor(Math.random() * tiposDeMonstruos.length)];
    var desplazamientoX = Math.random() * 20; // Ajusta según tus necesidades
    var desplazamientoY = Math.random() * 20; // Ajusta según tus necesidades

    var monstruoElement = $("<div class='monstruo'>").css({
      position: "absolute",
      left: desplazamientoX + "px",
      top: desplazamientoY + "px",
      width: tipoMonstruo.width + "px",
      height: tipoMonstruo.height + "px",
      backgroundColor: "transparent",
      backgroundImage: tipoMonstruo.sprite,
      backgroundSize: "cover",
      zIndex: "10", // Ajusta según tus necesidades
    });

    // Añadir vida al monstruo
    var vidaMonstruo = tipoMonstruo.vida; // Ajusta según tus necesidades
    var vidaElement = $("<p class='vidaMonstruo text-white '>").text(
      "❤️: " + vidaMonstruo
    );
    monstruoElement.append(vidaElement);

    // Añadir nombre al monstruo
    var nombreElement = $("<p class='nombreMonstruo text-white'>").text(
      tipoMonstruo.nombre
    );
    monstruoElement.append(nombreElement);

    var idMonstruoLocal = parseInt(Math.random() * (100000000 - 1) + 1);
    monstruoElement.attr("id", "monstruo_" + idMonstruoLocal);
    monstruoElement.attr("vida", vidaMonstruo);
    $(".portal").append(monstruoElement);
    animarMonstruo(monstruoElement, tipoMonstruo.velocidad);
  }
}

function actualizarVida(monstruoElement) {
  var vidaActual = parseInt(monstruoElement.attr("vida")) || 0;
  var idMonstruo = monstruoElement.attr("id");

  // Seleccionar el elemento de vida dentro del monstruo
  var vidaElement = monstruoElement.find(".vidaMonstruo");

  // Actualizar el texto de la vida
  vidaElement.text("❤️: " + vidaActual);

  // Verificar si la vida del monstruo ha llegado a cero y eliminarlo si es el caso
  if (vidaActual <= 0 || isNaN(vidaActual)) {
    monstruoElement.remove();
    console.log("Monstruo ID: " + idMonstruo + " eliminado");
  }
}

// Función para quitar vida al monstruo y mostrar el daño
function quitarVidaMonstruo(monstruoElement) {
  var vidaActual = monstruoElement.attr("vida");
  var idMonstruo = monstruoElement.attr("id");

  vidaActual -= danio;

  var danioElement = $(
    "<div class='danio-monstruo bg-dark px-2 rounded-pill '>" +
      "-" +
      danio +
      "</div>"
  );

  // Posicionar el elemento del daño sobre el monstruo
  danioElement.css({
    position: "absolute",
    top: monstruoElement.offset().top + monstruoElement.width() / 2,
    left: monstruoElement.offset().left + monstruoElement.width() / 2,
  });

  // Agregar el elemento del daño al contenedor del mapa
  $("#pastoRocaContainer").append(danioElement);

  // Se borra después de 2 segundos
  setTimeout(function () {
    danioElement.fadeOut(200, function () {
      danioElement.remove();
    });
  }, 200);

  monstruoElement.attr("vida", vidaActual);
  actualizarVida(monstruoElement);
  console.log("Daño: " + danio + " a Monstruo ID: " + idMonstruo);

  // Verificar si la vida del monstruo ha llegado a cero y eliminarlo si es el caso
  if (vidaActual <= 0) {
    monstruoElement.remove();
    console.log("Monstruo ID: " + idMonstruo + " eliminado");
    console.log(monstruoElement);
  }
}

// intligencia de los mobs o enemigos

function animarMonstruo(monstruoElement, velocidad) {
  monstruoElement.on("click", function () {
    quitarVidaMonstruo(monstruoElement);
  });
  actualizarVida(monstruoElement);
  var totalPasos = 0;
  var pasoActual = 0;
  var velocidad = monstruoElement.velocidad;
  var intervaloAtaque = setInterval(function () {
    // Incrementar el contador de pasos
    pasoActual++;
    var rangoCasaCercana = 800; // Rango para considerar una casa cercana en píxeles
    var casaCercana = encontrarCasaCercana(monstruoElement, rangoCasaCercana);

    if (casaCercana) {
      // Almacena la posición de la casa conocida
      ultimaCasaConocidaX = casaCercana.offset().left + casaCercana.width() / 2;
      ultimaCasaConocidaY = casaCercana.offset().top + casaCercana.height() / 2;

      // Cambiar la dirección hacia la casa cercana y atacarla
      atacarCasa(monstruoElement, casaCercana);
      // Detener el intervalo para evitar conflictos con el ataque
      clearInterval(intervaloAtaque);
    } else {
      // Si no hay casa cercana, seguir moviéndose hacia la última posición conocida de una casa
      totalPasos = Math.max(
        Math.abs(monstruoElement.offset().left - ultimaCasaConocidaX),
        Math.abs(monstruoElement.offset().top - ultimaCasaConocidaY)
      );
      moverHaciaUltimaCasaConocida(monstruoElement, totalPasos, velocidad);
    }

    // Si se han dado todos los pasos, detener la animación
    if (pasoActual >= totalPasos) {
      clearInterval(intervaloAtaque);
    }
  }, 1000 / velocidad);
}
function encontrarCasaCercana(monstruoElement, rangoAtaque) {
  // Obtener la posición del monstruo
  var monstruoX = monstruoElement.offset().left + monstruoElement.width() / 2;
  var monstruoY = monstruoElement.offset().top + monstruoElement.height() / 2;

  // Iterar sobre las casas para encontrar la más cercana dentro del rango
  var casaCercana = null;
  var distanciaCercana = rangoAtaque + 1; // Inicializar con un valor mayor al rango de ataque

  $(".casa").each(function () {
    var casa = $(this);

    var casaX = casa.offset().left + casa.width() / 2;
    var casaY = casa.offset().top + casa.height() / 2;

    // Calcular la distancia entre el monstruo y la casa
    var distancia = Math.sqrt(
      Math.pow(monstruoX - casaX, 2) + Math.pow(monstruoY - casaY, 2)
    );

    // Verificar si la casa está dentro del rango de ataque y más cercana que la actual
    if (distancia < rangoAtaque && distancia < distanciaCercana) {
      casaCercana = casa;
      distanciaCercana = distancia;
    }
  });
  console.log(casa);
  if (casaCercana == null) {
    continuarHaciaCentro(monstruoElement);
    console.log('Centro');
  }

  return casaCercana;
}

function continuarHaciaCentro(monstruoElement) {
  var centroMineral = $(".mineral-centro");
  var centroX = centroMineral.offset().left + centroMineral.width() / 2;
  var centroY = centroMineral.offset().top + centroMineral.height() / 2;

  var velocidad = monstruoElement.velocidad;

  var intervaloCentro = setInterval(function () {
    // Obtener la posición actual del monstruo
    var monstruoX = monstruoElement.offset().left + monstruoElement.width() / 2;
    var monstruoY = monstruoElement.offset().top + monstruoElement.height() / 2;

    // Calcular la dirección hacia el centro
    var direccionX = centroX - monstruoX;
    var direccionY = centroY - monstruoY;
    var distancia = Math.sqrt(
      direccionX * direccionX + direccionY * direccionY
    );

    // Normalizar la dirección
    var pasoX = direccionX / distancia;
    var pasoY = direccionY / distancia;

    // Mover el monstruo un paso hacia el centro
    monstruoElement.css({
      left: "+=" + pasoX * velocidad,
      top: "+=" + pasoY * velocidad,
    });

    // Si ha llegado al centro, detener el intervalo
    if (distancia < velocidad) {
      clearInterval(intervaloCentro);
    }
  }, 1000 / velocidad);
}

function atacarCasa(monstruoElement, casaElement) {
  var velocidadAtaque = 1000; // Tiempo entre cada ataque en milisegundos

  // Configurar un temporizador para golpear la casa cada cierto tiempo
  var temporizadorAtaque = setInterval(function () {
    // Reducir la vida de la casa en 1 (ajusta según tus necesidades)
    var vidaCasa = parseInt(casaElement.data("vida")) || 0;
    vidaCasa -= 1;

    // Actualizar la vida de la casa
    casaElement.data("vida", vidaCasa);

    actualizarVidaCasas(casaElement);

    // Si la vida de la casa llega a cero, detener el ataque
    if (vidaCasa <= 0) {
      clearInterval(temporizadorAtaque);
      casaElement.remove();
      console.log("Monstruo ha destruido la casa");
    }
  }, velocidadAtaque);
}

function actualizarVidaCasas(casaElement) {
  var vidaActual = parseInt(casaElement.attr("vida")) || 0;
  var idCasa = casaElement.attr("id");

  // Seleccionar el elemento de vida dentro del monstruo
  var vidaElement = $("#vida_" + idCasa);
  console.log(vidaElement);
  // Actualizar el texto de la vida
  vidaElement.text("❤️: " + vidaActual);

  // Verificar si la vida del monstruo ha llegado a cero y eliminarlo si es el caso
  if (isNaN(vidaActual) || vidaActual <= 0) {
    // Puedes elegir si eliminar solo el elemento de vida o la casa completa
    vidaElement.remove();
    casaElement.remove();
  }
}

function moverHaciaUltimaCasaConocida(monstruoElement) {
  if (ultimaCasaConocidaX !== null && ultimaCasaConocidaY !== null) {
    // Obtener la posición actual del monstruo
    var velocidad = monstruoElement.velocidad;
    var monstruoX = monstruoElement.offset().left + monstruoElement.width() / 2;
    var monstruoY = monstruoElement.offset().top + monstruoElement.height() / 2;

    // Calcular la dirección hacia la última posición conocida de una casa
    var direccionX = ultimaCasaConocidaX - monstruoX;
    var direccionY = ultimaCasaConocidaY - monstruoY;
    var distancia = Math.sqrt(
      direccionX * direccionX + direccionY * direccionY
    );

    // Normalizar la dirección
    var pasoX = direccionX / distancia;
    var pasoY = direccionY / distancia;

    // Mover el monstruo un paso hacia la última posición conocida de una casa
    monstruoElement.css({
      left: "+=" + pasoX * velocidad,
      top: "+=" + pasoY * velocidad,
    });
   
  }
}
