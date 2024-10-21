let imagenPelota;
let imagenRaqueta;
let imagenComputadora;
let imagenFondo;
let sonidoRaqueta;
let sonidoGoal;

let puntosJugador = 0;
let puntosComputadora = 0;

let juegoIniciado = false; // Variable para controlar el estado del juego

class Pelota {
    constructor(x, y, diameter, vx, vy) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.vx = vx;
        this.vy = vy;
        this.reset();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.vx + this.vy;

        if (this.x > width - this.diameter / 2 || this.x < this.diameter / 2) {
            sonidoGoal.play();
            if (this.x < width / 2) {
                puntosComputadora++;
            } else {
                puntosJugador++;
            }
            this.reset();
        }

        if (this.y > height - this.diameter / 2 || this.y < this.diameter / 2) {
            this.vy *= -1;
        }

        if (colision(this.x, this.y, this.diameter, raqueta.x, raqueta.y, raqueta.width, raqueta.height) || colision(this.x, this.y, this.diameter, computadora.x, computadora.y, computadora.width, computadora.height)) {
            sonidoRaqueta.play();
            this.vx *= -1;
            this.vx *= 1.1;
            this.vy *= 1.1;

            // Limitar la velocidad máxima
            this.vx = constrain(this.vx, -10, 10);
            this.vy = constrain(this.vy, -10, 10);

            // Mover la pelota fuera de la raqueta para evitar que quede atrapada
            if (this.x < width / 2) {
                this.x = raqueta.x + raqueta.width + this.diameter / 2;
            } else {
                this.x = computadora.x - this.diameter / 2;
            }
        }
    }

    reset() {
        this.x = 400;
        this.y = 200;
        this.vx = 5 * (Math.random() < 0.5 ? -1 : 1);
        this.vy = 5 * (Math.random() < 0.5 ? -1 : 1);
        this.rotation = 0;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        image(imagenPelota, -this.diameter / 2, -this.diameter / 2, this.diameter, this.diameter);
        pop();
    }
}

class Raqueta {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update() {
        // Mueve la raqueta del jugador (izquierda) con el ratón o el toque
        if (this.x < width / 2) {
            if (touches.length > 0) {
                this.y = touches[0].y; // Usar la posición del toque
            } else {
                this.y = mouseY; // Si no hay toque, usar mouseY
            }
        } else {
            // Lógica de la computadora
            if (pelota.y > this.y) {
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            }
        }
        this.y = constrain(this.y, 0, height - this.height);
    }

    draw() {
        if (this.x < width / 2) {
            image(imagenRaqueta, this.x, this.y, this.width, this.height);
        } else {
            image(imagenComputadora, this.x, this.y, this.width, this.height);
        }
    }
}

// Función de p5.js que detecta el movimiento táctil
function touchMoved() {
    // Mueve la raqueta del jugador (izquierda) según la posición vertical del toque en cualquier parte de la pantalla
    raqueta.y = touches[0].y - raqueta.height / 2; // Ajusta la raqueta para que el toque esté centrado

    // Asegura que la raqueta no se salga de los límites del canvas
    raqueta.y = constrain(raqueta.y, 0, height - raqueta.height);

    return false; // Evita el comportamiento por defecto del navegador
}


let pelota;
let raqueta;
let computadora;

function colision(cx, cy, diameter, rx, ry, rw, rh) {
    return cx + diameter / 2 > rx && cx - diameter / 2 < rx + rw && cy + diameter / 2 > ry && cy - diameter / 2 < ry + rh;
}

function preload() {
    imagenPelota = loadImage('/sprites/pelota2.png');
    imagenRaqueta = loadImage('/sprites/raqueta3.png');
    imagenComputadora = loadImage('/sprites/raqueta3.png');
    imagenFondo = loadImage('/sprites/fondo.jpg');
    sonidoRaqueta = loadSound('/assets/bright-bounce.wav');
    sonidoGoal = loadSound('/assets/objective-complete.wav');
}

function setup() {
    createCanvas(800, 400);
    pelota = new Pelota(400, 200, 40, 5, 5);
    raqueta = new Raqueta(20, 150, 25, 110, 5);
    computadora = new Raqueta(750, 150, 25, 110, 5);

    // Evento para iniciar el juego
    const botonJugar = document.getElementById('jugar');
    botonJugar.addEventListener('click', iniciarJuego);

    // Agregamos un eventListener para el toque en toda la ventana
    window.addEventListener('touchmove', moverRaquetaJugador);
}

function moverRaquetaJugador(event) {
    // Prevenimos el comportamiento por defecto
    event.preventDefault();

    // Obtenemos la posición del toque
    let toque = event.touches[0];

    // Ajustamos la posición de la raqueta basándonos en la posición vertical del toque
    raqueta.y = toque.clientY - raqueta.height / 2;

    // Aseguramos que la raqueta no se salga de los límites del canvas
    raqueta.y = constrain(raqueta.y, 0, height - raqueta.height);
}
function iniciarJuego() {
    juegoIniciado = true; // Cambia el estado del juego
    document.getElementById('jugar').disabled = true; // Desactiva el botón
}

function dibujarContador() {
    fill(255); // Color blanco para el texto
    textAlign(CENTER, CENTER);
    textSize(45);
    textFont('Chakra Petch');
    text(`${puntosJugador}        ${puntosComputadora}`, width / 2, 30);
}

function mostrarGanador(ganoJugador) {
    fill(255); // Color blanco para el texto
    textAlign(CENTER, CENTER);
    textSize(48);
    textFont('Chakra Petch');
    if (ganoJugador) {
        text('¡Ganaste!', width / 2, height / 2);
    } else {
        text('¡Ganó la Computadora!', width / 2, height / 2);
    }

    let botonJugar = document.getElementById('jugar');
    botonJugar.disabled = false;
    botonJugar.textContent = "Volver a jugar";
    botonJugar.addEventListener('click', reiniciarJuego);
}

function reiniciarJuego() {
    puntosJugador = 0;
    puntosComputadora = 0;
    pelota.reset();
    loop();
    juegoIniciado = true;
    document.getElementById('jugar').disabled = true;
}

function draw() {
    image(imagenFondo, 0, 0, width, height);

    if (juegoIniciado) {
        dibujarContador();

        if (puntosJugador >= 10) {
            mostrarGanador(true);
            noLoop();
            return;
        } else if (puntosComputadora >= 10) {
            mostrarGanador(false);
            noLoop();
            return;
        }

        pelota.update();
        pelota.draw();
        raqueta.update();
        raqueta.draw();
        computadora.update();
        computadora.draw();
    }
}
