var portales = [];
var monstruosPorPortal = 1;
var oleadasPasadas = 0;
var tiempo = 10;
var tiempoEntreOleadas = 5 * 60 * 1000; // 2 minutos
var tiempoRestanteEntreOleadas = tiempoEntreOleadas;
var danio = 10; // daño por click hacia los mounstros
var log = 0;
var ultimaCasaConocidaX = null;
var ultimaCasaConocidaY = null;
var cantidadMonstruos = 0;
var clouds = document.querySelectorAll('.cloud');
var duracionAnimacion = 80 / tiempo; // Convertir segundos a milisegundos

clouds.forEach(function (cloud) {
  cloud.style.animationDuration = duracionAnimacion + 's';
});

$("#oleadas_counter").text(oleadasPasadas);
var tiposDeMonstruos = [
  {
    nombre: "Duende",
    vida: 30,
    velocidad: 1.2,
    width: 40,
    height: 40,
    daño: 1,
    sprite: "url(./assets/img/enemys/2/D_Walk.png)",
  },
  {
    nombre: "Lobo",
    vida: 20,
    velocidad: 1.3,
    width: 50,
    height: 50,
    daño: 2,
    sprite: "url(./assets/img/enemys/3/D_Walk.png)",
  },
  {
    nombre: "Alfa",
    vida: 70,
    velocidad: 12,
    width: 60,
    height: 60,
    daño: 4,
    sprite: "url(./assets/img/enemys/3/D_Walk.png)",
  },
  {
    nombre: "Orco",
    vida: 150,
    velocidad: 12,
    width: 75,
    height: 75,
    daño: 6,
    sprite: "url(./assets/img/enemys/2/D_Walk.png)",
  },
  // Agrega más tipos de monstruos según tus necesidades
];
// Lógica para generar la oleada
function generarOleada() {
  generarPortal();
  $("#oleadas_counter").text(oleadasPasadas);
  $("body").addClass("luna-de-sangre");
  setTimeout(
    function () {
      $("body").removeClass("luna-de-sangre");
    },
    (2 * 60 * 1000) / tiempo
  ); // 2 minutos en milisegundos
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
    $('#multiplicador_tiempo').text(tiempo);
    // Actualizar el tiempo restante en el elemento #time_oleada
    $("#time_oleada").text(convertirTiempo(tiempoRestanteEntreOleadas));

    // Si el tiempo restante llega a cero, generar una nueva oleada
    if (tiempoRestanteEntreOleadas <= 0) {
      generarOleada();
      tiempoRestanteEntreOleadas = tiempoEntreOleadas;
    }
  }, 1000 / tiempo);
}
// Función para generar un portal en los bordes del mapa
function generarPortal() {
  oleadasPasadas++;
  monstruosPorPortal *= 1.1;

  // Coordenadas del centro predeterminadas
  var centerX = centroX;
  var centerY = centroY;
  var radius = 1000; // Radio del círculo

  // Generar un ángulo aleatorio
  var angle = Math.random() * Math.PI * 2;

  // Calcular las coordenadas dentro del círculo usando trigonometría
  var x = centerX + Math.cos(angle) * radius;
  var y = centerY + Math.sin(angle) * radius;

  // Imprimir las coordenadas generadas
  var log =
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
    zIndex: "20", // Ajusta según tus necesidades
  });
  $("#casasContainer").append(portalElement);
  portales.push({ x: x, y: y });
  generarMonstruo();
}

// Función para generar un monstruo
function generarMonstruo() {
  cantidadMonstruos = 0;
  for (let i = 0; i < monstruosPorPortal; i++) {
    var tipoMonstruo =
      tiposDeMonstruos[Math.floor(Math.random() * tiposDeMonstruos.length)];
    var desplazamientoX = Math.random() * 300; // Ajusta según tus necesidades
    var desplazamientoY = Math.random() * 400; // Ajusta según tus necesidades

    var monstruoElement = $("<div class='monstruo hover:cursor-pointer'>").css({
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
    var vidaMonstruo =
      tipoMonstruo.vida + tipoMonstruo.vida * (oleadasPasadas / 100); // Ajusta según tus necesidades
    var vidaElement = $(
      "<p class='vidaMonstruo text-white hover:cursor-pointer'>"
    ).text("❤️: " + vidaMonstruo);
    monstruoElement.append(vidaElement);

    // Añadir nombre al monstruo
    var nombreElement = $(
      "<p class='nombreMonstruo text-white hover:cursor-pointer'>"
    ).text(tipoMonstruo.nombre);
    monstruoElement.append(nombreElement);

    var idMonstruoLocal = parseInt(Math.random() * (10000000000 - 1) + 1);
    monstruoElement.attr("id", "monstruo_" + idMonstruoLocal);
    monstruoElement.attr("vida", vidaMonstruo);
    monstruoElement.attr("velocidad", tipoMonstruo.velocidad);
    monstruoElement.attr("daño", tipoMonstruo.daño);
    $(".portal").append(monstruoElement);
    animarMonstruo(monstruoElement);
    cantidadMonstruos++;
  }
  if (cantidadMonstruos > 0) {
  } else {
    // Si no hay monstruos, quitar la clase luna-de-sangre
    $("body").removeClass("luna-de-sangre");
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
    sendLogs("💀 " + idMonstruo + " eliminado");
    
  }
  var elementos = document.querySelectorAll('.monstruo').length;
  if (elementos == 0) {
    $("body").removeClass("luna-de-sangre");
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
    top: monstruoElement.offset().top + monstruoElement.height() / 5,
    left: monstruoElement.offset().left + monstruoElement.width() / 2,
  });

  // Agregar el elemento del daño al mismo contenedor que el monstruo
  $('#main-container').parent().append(danioElement);

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
  }
}

function animarMonstruo(monstruoElement) {
  monstruoElement.on("click", function () {
    quitarVidaMonstruo(monstruoElement);
  });

  actualizarVida(monstruoElement);

  var intervaloAtaque; // Declara la variable fuera del intervalo

  // Función para manejar el ataque y la búsqueda de casas cercanas
  function manejarAtaque() {
    var rangoCasaCercana = 1500; // Rango para considerar una casa cercana en píxeles
    var casaCercana = encontrarCasaCercana(monstruoElement, rangoCasaCercana);

    if (casaCercana) {
      // Almacena la posición de la casa conocida
      ultimaCasaConocidaX = casaCercana.offset().left + casaCercana.width() / 1;
      ultimaCasaConocidaY = casaCercana.offset().top + casaCercana.height() / 1;
      // Cambiar la dirección hacia la casa cercana y atacarla
      atacarCasa(monstruoElement, casaCercana);
    } else {
      // Si no hay casa cercana, seguir moviéndose hacia la última posición conocida de una casa
      moverHaciaCasaCercana(monstruoElement);
    }
  }

  // Iniciar el intervalo de ataque
  intervaloAtaque = setInterval(manejarAtaque, 1000 / tiempo);

  var velocidad = monstruoElement.attr("velocidad");

  var intervaloMovimiento = setInterval(function () {
    // Función para manejar el movimiento hacia la última casa conocida
    function manejarMovimiento() {
      // Obtener todas las casas en la página
      var casaCercana = encontrarCasaCercana(monstruoElement, 1200); // Rango de búsqueda de casas cercanas

      if (casaCercana) {
        clearInterval(intervaloAtaque); // Detener el intervalo de ataque
        clearInterval(intervaloMovimiento); // Detener el intervalo de movimiento

        manejarAtaque(); // Realizar el ataque a la casa cercana
      } else {
        // Si no hay casa cercana, continuar moviéndose hacia la última casa conocida
        moverHaciaCasaCercana(monstruoElement);
      }
    }

    manejarMovimiento(); // Llamar a la función de manejo de movimiento

    // Actualizar las coordenadas x e y del monstruo
    var posX = monstruoElement.offset().left;
    var posY = monstruoElement.offset().top;
    monstruoElement.attr("x", posX);
    monstruoElement.attr("y", posY);
  }, 1000 / tiempo);
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

  // Si no se encontró ninguna casa dentro del rango, devolver null para indicar que no hay casa cercana
  if (!casaCercana) {
    return null;
  }

  return casaCercana;
}

function moverHaciaCasaCercana(monstruoElement) {
  // Obtener todas las casas en la página
  var velocidad = monstruoElement.attr("velocidad");
  var factorTiempo = tiempo; // Ajusta esto según el factor de tiempo actual
  var velocidadAjustada = velocidad * factorTiempo;

  // Encontrar la casa más cercana
  var rangoAtaque = 1000; // Define aquí el rango de ataque adecuado
  var casaCercana = encontrarCasaCercana(monstruoElement, rangoAtaque);

  if (casaCercana) {
    // Almacenar la posición de la casa conocida
    var casaCercanaX = casaCercana.offset().left + casaCercana.width() / 2;
    var casaCercanaY = casaCercana.offset().top + casaCercana.height() / 2;

    // Calcular la distancia entre el monstruo y la casa cercana
    var distanciaX = casaCercanaX - monstruoElement.offset().left;
    var distanciaY = casaCercanaY - monstruoElement.offset().top;

    // Calcular la cantidad total de pasos necesarios
    var totalPasos = Math.max(Math.abs(distanciaX), Math.abs(distanciaY));

    // Iniciar el intervalo para moverse hacia la casa más cercana
    var pasoActual = 0;
    var intervaloMovimiento = setInterval(
      function () {
        // Incrementar el contador de pasos
        pasoActual++;
        // Calcular la posición actual del monstruo en este paso
        var pasoX = monstruoElement.offset().left + distanciaX / totalPasos;
        var pasoY = monstruoElement.offset().top + distanciaY / totalPasos;
        // Mover el monstruo un paso
        monstruoElement.offset({ left: pasoX, top: pasoY });
        // Si se han dado todos los pasos, detener el intervalo
        if (pasoActual >= totalPasos) {
          clearInterval(intervaloMovimiento);
        }
      },
      1000 / tiempo // Ajusta la velocidad según el tiempo
    );
  } else {
    var distanciaPasoX = velocidadAjustada * 0.1; // Ajusta la distancia de cada paso
    var distanciaPasoY = velocidadAjustada * 0.1; // Ajusta la distancia de cada paso
    var totalPasosAleatorios = Math.max(
      Math.abs(distanciaPasoX),
      Math.abs(distanciaPasoY)
    );
    // Realizar un bucle para mover el monstruo en múltiples pasos aleatorios
    for (var i = 0; i < totalPasosAleatorios; i++) {
      // Calcular la dirección aleatoria
      var direccionX = Math.random() * 2 - 1; // Valor entre -1 y 1
      var direccionY = Math.random() * 2 - 1; // Valor entre -1 y 1

      // Calcular el paso de movimiento en la dirección aleatoria
      var pasoX = monstruoElement.offset().left + distanciaPasoX * direccionX;
      var pasoY = monstruoElement.offset().top + distanciaPasoY * direccionY;
      monstruoElement.attr("x", pasoX);
      monstruoElement.attr("y", pasoY);
      // Mover la unidad en la dirección aleatoria
      monstruoElement.animate(
        {
          left: "+=" + pasoX * velocidad,
          top: "+=" + pasoY * velocidad,
        },
        50000 / tiempo
      );
    }
  }
}

function atacarCasa(monstruoElement, casaElement) {
  var centerX = centroX;
  var centerY = centroY;

  var daño = monstruoElement.attr("daño") || 0;
  var velocidad = monstruoElement.attr("velocidad") || 10;
  var amenaza = 0;
  // Configurar un temporizador para mover al monstruo hacia la casa y golpearla
  var temporizadorAtaque = setInterval(function () {
    var monstruoX = monstruoElement.offset().left + monstruoElement.width() / 2;
    var monstruoY = monstruoElement.offset().top + monstruoElement.height() / 2;
    var casaX = casaElement.offset().left + casaElement.width() / 2;
    var casaY = casaElement.offset().top + casaElement.height() / 2;

    // Calcular la distancia entre el monstruo y la casa
    var distancia = Math.sqrt(
      Math.pow(monstruoX - casaX, 2) + Math.pow(monstruoY - casaY, 2)
    );

    // Si el monstruo está a menos de 4 píxeles de la casa, golpearla
    if (distancia <= 3) {
      amenaza++;

      if (amenaza >= 5) {
        sendLogs("⛔ Estas siendo atacado");
        amenaza = 0;
      }
      var vidaCasa = casaElement.data("vida") || 0;
      vidaCasa = vidaCasa - daño;

      if (vidaCasa < 0 || isNaN(vidaCasa)) {
        vidaCasa = 0;
      }

      casaElement.data("vida", vidaCasa);
      actualizarVidaCasas(casaElement);

      console.log("Casa ha recibido un golpe, " + vidaCasa + " restantes");

      // Si la vida de la casa llega a cero, detener el ataque
      if (vidaCasa <= 0) {
        clearInterval(temporizadorAtaque);
        sendLogs("🚩 Una edificacion a sido destruida");
        casaElement.remove();
      }
    } else {
      amenaza = 0;
      // Si el monstruo está a más de 4 píxeles de la casa, moverlo hacia la casa
      var direccionX = casaX - monstruoX;
      var direccionY = casaY - monstruoY;
      var distanciaTotal = Math.sqrt(
        direccionX * direccionX + direccionY * direccionY
      );

      // Normalizar la dirección
      var pasoX = (direccionX / distanciaTotal) / tiempo;
      var pasoY = (direccionY / distanciaTotal) / tiempo;

      // Mover el monstruo hacia la casa
      monstruoElement.css({
        left: "+=" + pasoX,
        top: "+=" + pasoY,
      });
    }
  }, 1000);
}

function actualizarVidaCasas(casaElement) {
  var vidaActual = casaElement.attr("vida") || 0;
  var idCasa = casaElement.attr("id");
  // Seleccionar el elemento de vida dentro del monstruo
  var vidaElement = $("#vida_" + idCasa);
  // Actualizar el texto de la vida
  vidaElement.text("❤️: " + vidaActual);
}
