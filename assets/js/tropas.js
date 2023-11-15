// Función para generar soldados
function generarSoldado() {
    console.log('Gen Soldados');
    var soldado = $("<div class='element soldado'></div>").css({
      width: "70px",
      height: "70px",
      borderRadius: "80%",
      backgroundColor: "blue",
      position: "absolute",
    });
  
    // Posicionar el soldado aleatoriamente en el mineral-centro
    var centroDiv = $(".mineral-centro");
    var x = centroDiv.offset().left + Math.random() * centroDiv.width();
    var y = centroDiv.offset().top + Math.random() * centroDiv.height();
  
    soldado.css({
      left: x,
      top: y,
    });
  
    // Agregar el soldado al contenedor
    $("#pastoRocaContainer").append(soldado);
  
    // Mover el soldado aleatoriamente y buscar enemigos
    moverSoldado(soldado);
  }
  
  // Función para mover soldado aleatoriamente y buscar enemigos
  // Función para mover soldado aleatoriamente y buscar enemigos
function moverSoldado(soldado) {
    setInterval(function () {
      // Generar un movimiento aleatorio dentro del radio de 1800 px
      var angulo = Math.random() * 2 * Math.PI; // Ángulo aleatorio
      var radio = Math.random() * 3; // Distancia aleatoria dentro del radio
      var deltaX = radio * Math.cos(angulo);
      var deltaY = radio * Math.sin(angulo);
  
      // Obtener la posición actual del soldado
      var posX = soldado.offset().left;
      var posY = soldado.offset().top;
  
      // Calcular la nueva posición
      var nuevaPosX = posX + deltaX;
      var nuevaPosY = posY + deltaY;
  
      // Limitar la posición dentro del radio de 1800 px del centro
      var centroX = $(".mineral-centro").offset().left + $(".mineral-centro").width() / 2;
      var centroY = $(".mineral-centro").offset().top + $(".mineral-centro").height() / 2;
      var distanciaAlCentro = Math.sqrt(
        Math.pow(nuevaPosX - centroX, 2) + Math.pow(nuevaPosY - centroY, 2)
      );
  
      if (distanciaAlCentro <= 50) {
        // Mover el soldado a la nueva posición
        soldado.css({
          left: nuevaPosX,
          top: nuevaPosY,
        });
  
        // Verificar si hay enemigos cercanos
        var enemigos = $(".mounstro");
        enemigos.each(function () {
          var enemigo = $(this);
  
          // Verificar si el soldado está lo suficientemente cerca del enemigo
          if (
            Math.abs(nuevaPosX - enemigo.offset().left) < 30 &&
            Math.abs(nuevaPosY - enemigo.offset().top) < 30
          ) {
            // Mover el soldado hacia el enemigo
            soldado.animate(
              {
                left: enemigo.offset().left,
                top: enemigo.offset().top,
              },
              1000,
              function () {
                // Realizar alguna acción cuando el soldado alcanza al enemigo
                console.log("Soldado alcanzó al enemigo");
              }
            );
          }
        });
      }
    }, 1000);
  }
  
  
  // Llamar a la función para generar soldados
//generarSoldado();

  