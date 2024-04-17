var isDragging = false;
var lastMousePosition = {
  x: 0,
  y: 0,
};
var velocityFactor = 0.8;

$("#menu-up").on("click", function () {
  $("#menu-1").slideUp("slow"); // Efecto de desaparición hacia arriba
  $("#menu-2").slideDown("slow"); // Efecto de aparición desde abajo
});
$("#menu-down").on("click", function () {
  $("#menu-1").slideDown("slow"); // Efecto de desaparición hacia arriba
  $("#menu-2").slideUp("slow"); // Efecto de aparición desde abajo
});

$(document).ready(function () {
  $(
    "#botonesCompra, #botonesCompra2, #botonesCompra3, #botonesCompra4"
  ).empty();
  for (var i = 0; i < 6; i++) {
    var botonHtml = `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
              <button class="btn btn-dark border-0 shadow w-100 h-100 text-start py-0" onclick="comprarCasa(${i})" style="opacity: 1;font-size: 14px;">
                  <div style="opacity: 1;">
                  <div class="row">
                      <div class="col-4">
                      <img class="mb-2 mt-2" src="./assets/img/${tiposDeCasas[i].id}.png" style="width: 60px; height:50px;" alt="${tiposDeCasas[i].nombre}">
                      </div>
                      <div class="col-8">
                      ${tiposDeCasas[i].nombre} <br>
                      Precio: $<span class="precioCasa" data-indice="${i}">${tiposDeCasas[i].precio}</span><br>
                      Cantidad: <span class="cantidadCasa" data-indice="${i}">0</span>
                      </div>
                  </div>
                
                  </div>
              </button>
          </div>
  
          `;
    $("#botonesCompra").append(botonHtml);
  }
  for (var i = 0; i < tiposDeCasas.length; i++) {
    var botonHtml2 = `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
              <button class="btn btn-dark border-0 shadow w-100 h-100 text-start py-0" onclick="comprarCasa(${i})" style="opacity: 1;font-size: 14px;">
                  <div style="opacity: 1;">
                  <div class="row">
                      <div class="col-4">
                      <img class="mb-2 mt-2" src="./assets/img/${tiposDeCasas[i].id}.png" style="width: 60px; height:50px;" alt="${tiposDeCasas[i].nombre}">
                      </div>
                      <div class="col-8">
                      ${tiposDeCasas[i].nombre} <br>
                      Precio: $<span class="precioCasa" data-indice="${i}">${tiposDeCasas[i].precio}</span><br>
                      Cantidad: <span class="cantidadCasa" data-indice="${i}">0</span>
                      </div>
                  </div>
                
                  </div>
              </button>
          </div>
  
          `;
    $("#botonesCompra2").append(botonHtml2);
  }
  for (var i = 0; i < tiposDeDefensas.length; i++) {
    var botonHtml3 = `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
        <button class="btn btn-dark border-0 shadow w-100 h-100 text-start py-0" onclick="comprarCasa_Tropas(${i})" style="opacity: 1;font-size: 14px;">
            <div style="opacity: 1;">
            <div class="row">
                <div class="col-4">
                <img class="mb-1 mt-2" src="./assets/img/icons/${tiposDeDefensas[i].id}.png" style="width: 40px; height:40px;" alt="${tiposDeDefensas[i].nombre}">
                </div>
                <div class="col-8">
                ${tiposDeDefensas[i].nombre} <br>
                Precio: $<span class="precioDefensa" data-indice="${i}">${tiposDeDefensas[i].precio}</span><br>
                Cantidad: <span class="cantidadDefensa" data-indice="${i}">0</span>
                </div>
            </div>
          
            </div>
        </button>
    </div>
  
    `;
    $("#botonesCompra3").append(botonHtml3);
  }
  for (var i = 0; i < tiposDeMejoras.length; i++) {
    var botonHtml4 = `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
        <button class="btn btn-dark border-0 shadow w-100 h-100 text-start py-0" onclick="comprarMejora(${i})" style="opacity: 1;font-size: 14px;">
            <div style="opacity: 1;">
            <div class="row">
                <div class="col-4">
                <img class="mb-1 mt-2" src="./assets/img/items/${tiposDeMejoras[i].id}.png" style="width: 40px; height:40px; ;" alt="${tiposDeMejoras[i].nombre}">
                </div>
                <div class="col-8">
                ${tiposDeMejoras[i].nombre} <br>
                Precio: $<span class="precioMejora" data-indice="${i}">${tiposDeMejoras[i].precio}</span><br>
                Cantidad: <span class="cantidadMejora" data-indice="${i}">0</span>
                </div>
            </div>
          
            </div>
        </button>
    </div>
  
    `;
    $("#botonesCompra4").append(botonHtml4);
  }

  var scale = 1;

  $("body").on("wheel", function (e) {
    // Ajusta la escala según la dirección de la rueda
    scale += e.originalEvent.deltaY > 0 ? -0.1 : 0.1;

    // Limita la escala a un rango razonable
    scale = Math.min(Math.max(0.5, scale), 1);

    // Aplica la transformación de escala solo a los elementos que deben escalar
    $("#main-container").css("transform", "scale(" + scale + ")");
  });

  $("body").on("mousedown", function (e) {
    isDragging = true;
    lastMousePosition = {
      x: e.pageX,
      y: e.pageY,
    };
    e.stopPropagation();
  });

  $(document).on("mouseup", function () {
    isDragging = false;
  });

  $(document).on("mousemove", function (e) {
    if (isDragging) {
      var deltaX = e.pageX - lastMousePosition.x;
      var deltaY = e.pageY - lastMousePosition.y;

      // Mueve el contenedor principal
      $("#main-container").offset({
        top: $("#main-container").offset().top + deltaY * velocityFactor,
        left: $("#main-container").offset().left + deltaX * velocityFactor,
      });

      // Mueve la posición de fondo
      var backgroundPosition = $("#main-container")
        .css("background-position")
        .split(" ");
      var backgroundPositionX =
        parseFloat(backgroundPosition[0]) - deltaX * velocityFactor;
      var backgroundPositionY =
        parseFloat(backgroundPosition[1]) - deltaY * velocityFactor;

      $("#main-container").css(
        "background-position",
        backgroundPositionX + "px " + backgroundPositionY + "px"
      );

      lastMousePosition = {
        x: e.pageX,
        y: e.pageY,
      };
    }
  });
});

function getRandomPosition() {
  const randomX = Math.random() * window.innerWidth;
  const randomY = Math.random() * window.innerHeight;
  return { x: randomX, y: randomY };
}

function createCloud() {
  var containerClouds = $("#container-clouds");

  for (var i = 0; i < 34; i++) {
    var x = Math.random() * 100 + "%";
    var y = Math.random() * 100 + "%";

    var cloudElement = $("<div class='cloud'></div>").css({
      position: "absolute",
      left: x,
      top: y,
    });

    // Agrega clases aleatorias a la nube
    var randomClass = Math.floor(Math.random() * 4) + 1; // Números entre 1 y 5
    cloudElement.addClass("cloud-" + randomClass);

    containerClouds.append(cloudElement);
  }
}

// Llamada a la función para generar nubes
createCloud();
