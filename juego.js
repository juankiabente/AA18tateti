// ---------------------------------------------------------
// 1) DATOS DEL JUEGO (las "variables" que cambian mientras se juega)
// ---------------------------------------------------------

// El tablero es una lista de 9 casillas. Posiciones:
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8
// Cada casilla guarda "" (vacía), "X" o "O".
let tablero;
let turno;            // de quién es el turno: "X" o "O"
let fichasPuestas;    // cuántas fichas se colocaron en total (van de 0 a 6)
let elegida;          // casilla elegida para mover (o null si no hay ninguna)
let terminado;        // true cuando alguien ganó

// Las 8 líneas posibles para ganar (3 filas, 3 columnas, 2 diagonales)
const LINEAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // horizontales
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // verticales
  [0, 4, 8], [2, 4, 6]               // diagonales
];

// Referencias a los elementos de la página
const divTablero = document.getElementById("tablero");
const divMensaje = document.getElementById("mensaje");

// ---------------------------------------------------------
// 2) FUNCIONES
// ---------------------------------------------------------

// Arranca (o reinicia) una partida
function empezar() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  turno = "X";
  fichasPuestas = 0;
  elegida = null;
  terminado = false;
  dibujar();
}

// Devuelve la línea ganadora (por ejemplo [0,1,2]) o null si nadie ganó
function buscarGanador() {
  for (const linea of LINEAS) {
    const [a, b, c] = linea;
    if (tablero[a] !== "" && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
      return linea;
    }
  }
  return null;
}

// ¿Dos casillas son vecinas? (una al lado de la otra, incluyendo diagonales)
// Convertimos cada posición en fila y columna y vemos que la distancia sea 1 como máximo.
function sonVecinas(a, b) {
  const filaA = Math.floor(a / 3), colA = a % 3;
  const filaB = Math.floor(b / 3), colB = b % 3;
  return Math.abs(filaA - filaB) <= 1 && Math.abs(colA - colB) <= 1;
}

// Se ejecuta cada vez que el jugador toca una casilla
function clickCasilla(i) {
  if (terminado) return;

  if (fichasPuestas < 6) {
    // FASE 1: colocar fichas
    if (tablero[i] !== "") return;        // casilla ocupada, no hace nada
    tablero[i] = turno;
    fichasPuestas++;
    terminarTurno();
  } else {
    // FASE 2: mover fichas
    if (tablero[i] === turno) {
      elegida = i;                         // tocó una ficha propia: la elige
    } else if (elegida !== null && tablero[i] === "" && sonVecinas(elegida, i)) {
      tablero[i] = turno;                  // mueve la ficha a la casilla nueva
      tablero[elegida] = "";               // y deja vacía la de antes
      elegida = null;
      terminarTurno();
      return;
    }
    dibujar();
  }
}

// Revisa si ganó alguien; si no, pasa el turno al otro jugador
function terminarTurno() {
  if (buscarGanador()) {
    terminado = true;
  } else {
    turno = (turno === "X") ? "O" : "X";
  }
  dibujar();
}

// Actualiza lo que se ve en pantalla según los datos
function dibujar() {
  const ganadora = buscarGanador();
  divTablero.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const boton = document.createElement("button");
    boton.className = "casilla " + tablero[i];
    boton.textContent = tablero[i];
    if (i === elegida) boton.classList.add("elegida");
    if (ganadora && ganadora.includes(i)) boton.classList.add("ganadora");
    boton.onclick = function () { clickCasilla(i); };
    divTablero.appendChild(boton);
  }

  // Mensaje de arriba
  if (terminado) {
    divMensaje.textContent = "¡Ganó " + turno + "!";
  } else if (fichasPuestas < 6) {
    divMensaje.textContent = "Turno de " + turno + ": colocá una ficha";
  } else if (elegida === null) {
    divMensaje.textContent = "Turno de " + turno + ": elegí una ficha para mover";
  } else {
    divMensaje.textContent = "Turno de " + turno + ": tocá una casilla vacía vecina";
  }
}

// ---------------------------------------------------------
// 3) INICIO
// ---------------------------------------------------------
document.getElementById("reiniciar").onclick = empezar;
empezar();
