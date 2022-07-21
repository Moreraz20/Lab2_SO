import Proceso, { CPU, RR, Grafico } from "../clases.js";

let identificardor;
let listaProcesos;

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

  identificardor = setInterval(tempo, 50);
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

window.reiniciar = function reiniciar() {
  const contenedorBoton = document.getElementById("contenedor_boton");

  grafico.eliminarProceso(contenedorGrafico);

  grafico.crearProceso(listaProcesos, contenedorGrafico);

  crearProcesos();
  const tablaProcesos = document.getElementById("tablaProcesos");
  listaProcesos[0].eliminarTabla(tablaProcesos);
  listaProcesos.forEach((element) => {
    element.agregarTabla(tabla);
  });

  rr = new RR(listaProcesos, grafico, rr.dispacher);

  cpu = new CPU(listaProcesos);
  cpu.construirTabla();

  cont = 0;

  const botonReinicar = document.getElementById("boton_reiniciar");
  botonReinicar.remove();

  const botonCorrer = document.createElement("button");
  botonCorrer.id = "boton_empezar";
  botonCorrer.innerText = "Empezar";
  botonCorrer.setAttribute("onclick", "correrAlgoritmo()");

  contenedorBoton.appendChild(botonCorrer);
};

window.cambiarDispacher = function cambiarDispacher() {
  const contenedorDispacher = document.getElementById("contenedor_dispacher");
  contenedorDispacher.innerHTML = "";
  while (contenedorDispacher.firstChild) {
    contenedorDispacher.removeChild(contenedorDispacher.firstChild);
  }
  const divForm = document.createElement("div");
  divForm.id = "Form_Quantum";
  divForm.setAttribute("class", "formDispacher");

  const inputQuantum = document.createElement("input");
  inputQuantum.id = "input_quantum";
  inputQuantum.type = "text";
  inputQuantum.placeholder = "Quantum";

  const buttonSave = document.createElement("button");
  buttonSave.innerHTML = "Guardar";
  buttonSave.setAttribute("onclick", "guardarQuantum()");

  divForm.appendChild(inputQuantum);
  divForm.appendChild(buttonSave);

  contenedorDispacher.appendChild(divForm);
};

window.guardarQuantum = function guardarQuantum() {
  const quantum = document.querySelector("#input_quantum").value;

  const form = document.getElementById("Form_Quantum");
  form.remove();

  grafico.eliminarProceso(contenedorGrafico);

  grafico.crearProceso(listaProcesos, contenedorGrafico);

  crearProcesos();
  const tablaProcesos = document.getElementById("tablaProcesos");
  listaProcesos[0].eliminarTabla(tablaProcesos);
  listaProcesos.forEach((element) => {
    element.agregarTabla(tabla);
  });

  rr = new RR(listaProcesos, grafico, parseInt(quantum));

  cpu = new CPU(listaProcesos);
  cpu.construirTabla();

  cont = 0;

  const botonReinicar = document.getElementById("boton_reiniciar");
  if (botonReinicar) {
    const contenedorBoton = document.getElementById("contenedor_boton");

    botonReinicar.remove();

    const botonCorrer = document.createElement("button");
    botonCorrer.id = "boton_empezar";
    botonCorrer.innerText = "Empezar";
    botonCorrer.setAttribute("onclick", "correrAlgoritmo()");

    contenedorBoton.appendChild(botonCorrer);
  }
};

function crearProcesos() {
  const procesoA = new Proceso("A", 0, 6, { inicio: 3, duracion: 2 }, "vacio");
  const procesoB = new Proceso("B", 1, 8, { inicio: 1, duracion: 3 }, "vacio");
  const procesoC = new Proceso("C", 2, 7, { inicio: 5, duracion: 1 }, "vacio");
  const procesoD = new Proceso("D", 4, 3, { inicio: 0, duracion: 0 }, "vacio");
  const procesoE = new Proceso("E", 6, 9, { inicio: 2, duracion: 4 }, "vacio");
  const procesoF = new Proceso("F", 6, 2, { inicio: 0, duracion: 0 }, "vacio");

  listaProcesos = [procesoA, procesoB, procesoC, procesoD, procesoE, procesoF];
}

crearProcesos();

const tabla = document.getElementById("tablaProcesos");

listaProcesos.forEach((element) => {
  element.agregarTabla(tabla);
});

const grafico = new Grafico();

const contenedorGrafico = document.getElementById("contenedorGrafico");

grafico.crearProceso(listaProcesos, contenedorGrafico);

let rr = new RR(listaProcesos, grafico, 4);

let cont = 0;

function tempo() {
  /*************************************************************************************************************/
  console.log("Tiempo:", cont);
  /*************************************************************************************************************/
  if (rr.ejecutar(cont)) {
    clearInterval(identificardor);
    cpu.construirTabla();

    const contenedorBoton = document.getElementById("contenedor_boton");

    const botonEmpezar = document.getElementById("boton_detener");
    botonEmpezar.remove();

    const botonReinicar = document.createElement("button");
    botonReinicar.id = "boton_reiniciar";
    botonReinicar.innerText = "Reiniciar";
    botonReinicar.setAttribute("onclick", "reiniciar()");

    contenedorBoton.appendChild(botonReinicar);
  }
  cont++;
}

let cpu = new CPU(listaProcesos);
cpu.construirTabla();
