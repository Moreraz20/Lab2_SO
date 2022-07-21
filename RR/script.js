import Proceso, { CPU, RR, Grafico } from "../clases.js";

let identificardor;

window.prueba = function prueba() {
  console.log("Si funciona");
};

window.correrAlgoritmo = function correrAlgoritmo() {
  const contenedorBoton = document.getElementById("contenedor_boton");

  const botonEmpezar = document.getElementById("boton_empezar");
  botonEmpezar.remove();

  const botonDetener = document.createElement("button");
  botonDetener.id = "boton_detener";
  botonDetener.innerText = "Detener";
  botonDetener.setAttribute("onclick", "detenerAlgoritmo()");

  contenedorBoton.appendChild(botonDetener);
  identificardor = setInterval(tempo, 200);
};

window.detenerAlgoritmo = function detenerAlgoritmo() {
  const contenedorBoton = document.getElementById("contenedor_boton");

  const botonEmpezar = document.getElementById("boton_detener");
  botonEmpezar.remove();

  const botonCorrer = document.createElement("button");
  botonCorrer.id = "boton_empezar";
  botonCorrer.innerText = "Empezar";
  botonCorrer.setAttribute("onclick", "correrAlgoritmo()");

  contenedorBoton.appendChild(botonCorrer);
  clearInterval(identificardor);
};

const procesoA = new Proceso("A", 0, 6, { inicio: 3, duracion: 2 }, "vacio");
const procesoB = new Proceso("B", 1, 8, { inicio: 1, duracion: 3 }, "vacio");
const procesoC = new Proceso("C", 2, 7, { inicio: 5, duracion: 1 }, "vacio");
const procesoD = new Proceso("D", 4, 3, { inicio: 0, duracion: 0 }, "vacio");
const procesoE = new Proceso("E", 6, 9, { inicio: 2, duracion: 4 }, "vacio");
const procesoF = new Proceso("F", 6, 2, { inicio: 0, duracion: 0 }, "vacio");

let listaProcesos = [
  procesoA,
  procesoB,
  procesoC,
  procesoD,
  procesoE,
  procesoF,
];

const tabla = document.getElementById("tablaProcesos");

listaProcesos.forEach((element) => {
  element.agregarTabla(tabla);
});

const grafico = new Grafico();

const contenedorGrafico = document.getElementById("contenedorGrafico");

grafico.crearProceso(listaProcesos, contenedorGrafico);

const rr = new RR(listaProcesos, grafico,4);

let cont = 0;

function tempo() {
  /*************************************************************************************************************/
  console.log("Tiempo:",cont);
  /*************************************************************************************************************/
  if (rr.ejecutar(cont)) {
    clearInterval(identificardor);
  }
  cont++;
}
