import Proceso, { CPU, FCFS, Grafico } from "./clases.js";

window.prueba = function prueba() {
  console.log("Si funciona");
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

const fcfs = new FCFS(listaProcesos, grafico);
for (let index = 0; index < 10; index++) {
  //fcfs.ejecutar(index);
  //grafico.sleep(1000);
}
let identificardor = setInterval(tempo, 1000);

let cont = 0;

function tempo() {
  if (fcfs.ejecutar(cont) || cont == 38) {
    clearInterval(identificardor);
  }
  cont++;
}
