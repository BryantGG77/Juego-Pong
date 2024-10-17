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
            narrarPuntos();
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
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
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

let pelota;
let raqueta;
let computadora;

function colision(cx, cy, diameter, rx, ry, rw, rh) {
    if (cx + diameter / 2 < rx) return false;
    if (cy + diameter / 2 < ry) return false;
    if (cx - diameter / 2 > rx + rw) return false;
    if (cy - diameter / 2 > ry + rh) return false;
    return true;
}

function preload() {
    imagenPelota = loadImage('pelota.png');
    imagenRaqueta = loadImage('raqueta1.png');
    imagenComputadora = loadImage('raqueta2.png');
    imagenFondo = loadImage('fondo2.avif');
    sonidoRaqueta = loadSound('bounce.wav');
    sonidoGoal = loadSound('jingle_win_synth_02.wav');
}

function setup() {
    createCanvas(800, 400);
    pelota = new Pelota(400, 200, 50, 5, 5);
    raqueta = new Raqueta(20, 150, 20, 100, 5);
    computadora = new Raqueta(760, 150, 20, 100, 5);

    // Evento para iniciar el juego
    const botonJugar = document.getElementById('jugar');
    botonJugar.addEventListener('click', iniciarJuego);
}

function iniciarJuego() {
    juegoIniciado = true; // Cambia el estado del juego
    document.getElementById('jugar').disabled = true; // Desactiva el botón
}


let vocesDisponibles = [];

// Cargar las voces disponibles y almacenarlas
speechSynthesis.onvoiceschanged = function () {
    vocesDisponibles = speechSynthesis.getVoices();
};

function narrarPuntos() {
    let mensaje;

    // Verificar si alguien ha llegado a 10 puntos y narrar al ganador
    if (puntosJugador >= 10) {
        mensaje = new SpeechSynthesisUtterance("¡Ganaste! Felicidades.");
    } else if (puntosComputadora >= 10) {
        mensaje = new SpeechSynthesisUtterance("La computadora ha ganado. Mejor suerte la próxima vez.");
    } else {
        mensaje = new SpeechSynthesisUtterance(`Jugador ${puntosJugador}, Computadora ${puntosComputadora}`);
    }

    mensaje.lang = 'es-ES'; // Configura el idioma (puedes cambiarlo si lo deseas)
    mensaje.rate = 2; // Velocidad más rápida

    // Asegurarse de que las voces ya están cargadas
    const vozElegida = vocesDisponibles.find(voz => voz.name === 'Microsoft Pablo - Spanish (Spain)'); // Cambia aquí la voz deseada
    if (vozElegida) {
        mensaje.voice = vozElegida;
    }

    // Retrasar la narración del marcador 1 segundo (1000 milisegundos)
    setTimeout(() => {
        speechSynthesis.speak(mensaje);
    }, 1000); // 1000 milisegundos = 1 segundo
}


function dibujarContador() {
    fill(255); // Color blanco para el texto
    textAlign(CENTER, CENTER); // Alinear el texto al centro
    textSize(32); // Tamaño del texto
    textFont('Chakra Petch');
    text(`Jugador: ${puntosJugador} | Computadora: ${puntosComputadora}`, width / 2, 30); // Dibuja el texto en la posición deseada
}

function mostrarGanador(ganoJugador) {
    fill(255); // Color blanco para el texto
    textAlign(CENTER, CENTER); // Alinear el texto al centro
    textSize(48); // Tamaño del texto del ganador
    textFont('Chakra Petch');
    if (ganoJugador) {
        text('¡Ganaste!', width / 2, height / 2); // Mensaje para el jugador
    } else {
        text('¡Ganó la Computadora!', width / 2, height / 2); // Mensaje para la computadora
    }

    // Habilitar el botón de jugar nuevamente
    let botonJugar = document.getElementById('jugar');
    botonJugar.disabled = false; // Habilita el botón
    botonJugar.textContent = "Volver a jugar"; // Cambia el texto del botón
    botonJugar.addEventListener('click', reiniciarJuego); // Asocia la función de reinicio
}

function reiniciarJuego() {
    puntosJugador = 0; // Reiniciar los puntos
    puntosComputadora = 0;
    pelota.reset(); // Reiniciar la posición de la pelota
    loop(); // Reiniciar el juego
    juegoIniciado = true; // Cambiar el estado del juego
    document.getElementById('jugar').disabled = true; // Desactiva el botón nuevamente
}
function draw() {
    image(imagenFondo, 0, 0, width, height);

    if (juegoIniciado) {
        dibujarContador(); // Llama a la función para dibujar el contador

        // Verifica si alguien ha llegado a 10 puntos
        if (puntosJugador >= 10) {
            mostrarGanador(true); // El jugador gana
            noLoop(); // Detiene el juego
            return; // Sale de la función
        } else if (puntosComputadora >= 10) {
            mostrarGanador(false); // La computadora gana
            noLoop(); // Detiene el juego
            return; // Sale de la función
        }

        pelota.update();
        pelota.draw();
        raqueta.update();
        raqueta.draw();
        computadora.update();
        computadora.draw();
    }
}