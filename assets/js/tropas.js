var maxTropas = 5;

function quitarVidaMonstruo2(monstruoElement, daño) {
  var vidaActual = monstruoElement.attr("vida");
  var idMonstruo = monstruoElement.attr("id");
  vidaActual -= daño;

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
    sendLogs("💀 " + idMonstruo + " eliminado");
  }
}

function comprarCasa_Tropas(indice) {
  if (indice < tiposDeDefensas.length) {
    if (coin >= parseInt(tiposDeDefensas[indice].precio)) {
      coin -= parseInt(tiposDeDefensas[indice].precio);
      daño = tiposDeDefensas[indice].daño;
      // Incrementar el precio para la próxima compra
      tiposDeDefensas[indice].precio = tiposDeDefensas[indice].precio * aumentoPrecio;

      var getprecio = $(".precioDefensa[data-indice='" + indice + "']:first");
      var getcantidad = $(
        ".cantidadDefensa[data-indice='" + indice + "']:first"
      );

      var precioElement = $(".precioDefensa[data-indice='" + indice + "']");
      var cantidadElement = $(".cantidadDefensa[data-indice='" + indice + "']");

      var cantidad = parseInt(getcantidad.text()) + 1;
      var precioActual = parseInt(getprecio.text()) || 0; // Obtiene el precio actual o establece 0 si es NaN
      var nuevoPrecio = parseInt(precioActual + tiposDeDefensas[indice].precio);
      precioElement.empty().text(nuevoPrecio);
      cantidadElement.empty().text(cantidad);

      // Obtener las coordenadas del centro de .mineral-centro
      var centroMineral = $(".mineral-centro");
      var centroX = centroMineral.offset().left + centroMineral.width() / 2;
      var centroY = centroMineral.offset().top + centroMineral.height() / 2;

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
      var casaElement = $("<div class='casa " + tiposDeDefensas[indice].id + "'>")
        .css({ position: "absolute", left: x + "px", top: y + "px" })
        .data("vida", vidaInicial) // Guardar la vida en los datos del elemento
        .data("tropas", 0) // Inicializar el número de tropas en 0
        .appendTo("#casasContainer");
      casaElement.attr("id", "casa_" + idGenerated);
      casaElement.attr("daño", daño);
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
          left: centroCasaX - vidaElement.width() / -1500 + "px",
          top: centroCasaY + casaElement.height() / 2 + "px",
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "center",
          color: "white",
          zIndex: "1000000 !important",
        })
        .appendTo("#casasContainer");
      vidaElement.attr("id", "vida_" + idGenerated);
      // Mostrar el cuadrado de la casa
      var casaSquare = $("#casaSquare");
      casaSquare.css({ left: x + "px", top: y + "px", display: "block" });

      setInterval(function () {
        actualizarVidaCasa(casaElement, vidaElement);
      }, 1000 / tiempo);

      // Generar unidades desde la casa
      // Generar unidades desde la casa
      setInterval(function () {
        // Verificar si el número máximo de tropas no se ha alcanzado
        if (casaElement.data("tropas") < maxTropas) {
          // Llamar a la función para generar proyectiles
          generarProyectil(casaElement, $(".monstruo")); // Puedes ajustar cómo obtienes el monstruo aquí
        }
      }, 1000 / tiempo); // Cambia el tiempo según la velocidad deseada de generación de unidades
    } else {
      sendLogs('Saldo insuficiente');
    }
  }
}

function generarProyectil(torreElement) {
  // Obtener todos los monstruos en la página
  var monstruos = $(".monstruo");
  var danio = torreElement.attr("daño") || 1;
  // Encontrar el monstruo más cercano dentro del radio de 300px
  var monstruoMasCercano = null;
  var distanciaMasCorta = 300; // Radio de búsqueda

  monstruos.each(function () {
    var monstruo = $(this);
    var distancia = Math.sqrt(
      Math.pow(torreElement.offset().left - monstruo.offset().left, 2) +
      Math.pow(torreElement.offset().top - monstruo.offset().top, 2)
    );

    // Verificar si este monstruo está dentro del radio de búsqueda y es el más cercano
    if (distancia < distanciaMasCorta) {
      monstruoMasCercano = monstruo;
      distanciaMasCorta = distancia;
    }
  });

  if (monstruoMasCercano) {
    // Crear el elemento del proyectil y establecer su posición inicial en la torre
    var proyectil = $("<div class='proyectil'></div>").css({
      left: torreElement.offset().left,
      top: torreElement.offset().top,
    });

    // Agregar el proyectil al contenedor principal
    $('#proyectiles').append(proyectil);
    // Animar el proyectil para que se mueva hacia el monstruo más cercano
    proyectil.animate(
      {
        left: monstruoMasCercano.offset().left,
        top: monstruoMasCercano.offset().top,
      },
      2300 / tiempo, // Duración de la animación en milisegundos
      function () {
        // Una vez que la animación haya terminado (el proyectil llega al monstruo)
        proyectil.remove(); // Eliminar el proyectil de la página
        quitarVidaMonstruo2(monstruoMasCercano, danio); // Causar daño al monstruo
      }
    );
  }
}
