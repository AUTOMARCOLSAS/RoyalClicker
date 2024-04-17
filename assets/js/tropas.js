var maxTropas = 1

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
    top: monstruoElement.offset().top + monstruoElement.height() / 2,
    left: monstruoElement.offset().left + monstruoElement.width() / 2,
  });

  // Agregar el elemento del daño al mismo contenedor que el monstruo
  $('#casasContainer').parent().append(danioElement);

  // Se borra después de 2 segundos
  setTimeout(function () {
    danioElement.fadeOut(200, function () {
      danioElement.remove();
    });
  }, 200);

  monstruoElement.attr("vida", vidaActual);
  actualizarVida(monstruoElement);

  // Verificar si la vida del monstruo ha llegado a cero y eliminarlo si es el caso
  if (vidaActual <= 0) {
    monstruoElement.remove();
    var elementos = document.querySelectorAll('.monstruo').length;
    if (elementos == 0) {a
      $("body").removeClass("luna-de-sangre");
    }
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
      casaElement.attr("x",x);
      casaElement.attr("y",y);

      setInterval(function () {
        actualizarVidaCasa(casaElement, vidaElement);
      }, 1000 / tiempo);

      // Generar unidades desde la casa
      // Generar unidades desde la casa
      setInterval(function () {
        // Verificar si el número máximo de tropas no se ha alcanzado
        if (casaElement.data("tropas") < maxTropas) {
          // Llamar a la función para generar proyectiles
          generarProyectil(casaElement); // Puedes ajustar cómo obtienes el monstruo aquí
        }
      }, 6000 / tiempo); // Cambia el tiempo según la velocidad deseada de generación de unidades
    } else {
      sendLogs('Saldo insuficiente');
    }
  }
}

// Definir una variable para almacenar información de proyectiles
var proyectilesEnVuelo = {};

function generarProyectil(torreElement) {
  // Obtener todos los monstruos en la página
  var monstruos = $(".monstruo");
  var daño = torreElement.attr("daño") || 1;
  var casaX = parseInt(torreElement.attr("x")) + torreElement.width() / 2; // Obtener el centro de la casa en el eje X
  var casaY = parseInt(torreElement.attr("y")) + torreElement.height() / 2; // Obtener el centro de la casa en el eje Y

  // Declarar el proyectilId fuera del bloque if
  var proyectilId;

  // Encontrar el monstruo más cercano dentro del radio de búsqueda
  var monstruoMasCercano = null;
  var distanciaMasCorta = Infinity; // Inicializar con un valor muy grande

  monstruos.each(function () {
    var monstruo = $(this);
    var distancia = Math.sqrt(
      Math.pow(casaX - monstruo.offset().left, 2) +
      Math.pow(casaY - monstruo.offset().top, 2)
    );

    // Verificar si este monstruo está dentro del radio de búsqueda y es el más cercano
    if (distancia < distanciaMasCorta) {
      monstruoMasCercano = monstruo;
      distanciaMasCorta = distancia;
    }
  });

  if (monstruoMasCercano) {
    // Obtener el id del proyectil una vez que se decide disparar
    proyectilId = "proyectil_" + Date.now();

    // Verificar si el monstruo aún tiene vida
    if (monstruoMasCercano.attr("vida") > 0) {
      // Crear el elemento del proyectil y establecer su posición inicial en el centro de la casa
      var proyectil = $("<div class='proyectil'></div>").attr("id", proyectilId).css({
        left: casaX + "px",
        top: casaY + "px",
      });

      // Almacenar una referencia al monstruo al que está apuntando el proyectil
      proyectilesEnVuelo[proyectilId] = monstruoMasCercano;

      // Agregar el proyectil al contenedor principal
      $('#casasContainer').append(proyectil);
      var casaX = parseInt(torreElement.attr("x")) + torreElement.width() / 2; // Obtener el centro de la casa en el eje X
      var casaY = parseInt(torreElement.attr("y")) + torreElement.height() / 2; // Obtener el centro de la casa en el eje Y
      var monstruoX = parseInt(monstruoMasCercano.offset().left + monstruoMasCercano.width() / 2);
      var monstruoY = parseInt(monstruoMasCercano.offset().top + monstruoMasCercano.height() / 2);

      // Animar el proyectil para que se mueva hacia el monstruo más cercano
      proyectil.animate(
        {
          left: monstruoX,
          top: monstruoY,
        },
        4000 / tiempo, // Duración de la animación en milisegundos
        function () {
          // Una vez que la animación haya terminado (el proyectil llega al monstruo)
          // Verificar si el monstruo aún está vivo antes de causar daño
          var monstruo = proyectilesEnVuelo[proyectilId];
          if (monstruo.attr("vida") > 0) {
            quitarVidaMonstruo2(monstruo, daño); // Causar daño al monstruo
          }
          // Eliminar el proyectil de la lista de proyectiles en vuelo
          delete proyectilesEnVuelo[proyectilId];
          proyectil.remove(); // Eliminar el proyectil de la página
        }
      );
    } else {
      // Si el monstruo ya está muerto, simplemente no disparamos
      delete proyectilesEnVuelo[proyectilId];
      console.log("El monstruo ya está muerto, no se dispara.");
    }
  }
}
