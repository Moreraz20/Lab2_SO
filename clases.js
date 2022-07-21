export default class Proceso {
  constructor(nombre, llegada, ejecucion, bloqueo, estado) {
    this.nombre = nombre;
    this.llegada = llegada;
    this.ejecucion = ejecucion;
    this.bloqueo = bloqueo;
    this.estado = estado;
    this.estadoTiempo = { ejecucion: 0, bloqueo: 0 };
  }

  agregarTabla(tabla) {
    const tr = document.createElement("tr");

    const td2 = document.createElement("td");
    td2.innerHTML = this.nombre; //Columna Nombre

    const td3 = document.createElement("td");
    td3.innerHTML = this.llegada; //Columna llegada

    const td4 = document.createElement("td");
    td4.innerHTML = this.ejecucion; //Columna ejecucion

    const td5 = document.createElement("td");
    td5.innerHTML = this.bloqueo.inicio; //Columna inicio bloqueo

    const td6 = document.createElement("td");
    td6.innerHTML = this.bloqueo.duracion; //Columna duracion bloqueo

    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    tabla.appendChild(tr);
  }

  eliminarTabla(tablaAntigua) {
    while (tablaAntigua.firstChild) {
      tablaAntigua.removeChild(tablaAntigua.firstChild);
    }
  }
}

export class CPU {
  constructor(
    encendido,
    desocupada,
    promRetorno,
    promEjecucion,
    promEspera,
    promTiempoPerdido
  ) {
    this.contador;
    this.encendido = encendido;
    this.desocupada = desocupada;
    this.tiempoTotal = encendido - desocupada;
    this.promRetorno = promRetorno;
    this.promEjecucion = promEjecucion;
    this.promEspera = promEspera;
    this.promTiempoPerdido = promTiempoPerdido;
  }
}

export class Grafico {
  constructor() {}

  crearProceso(listProcesos, grafico) {
    listProcesos.forEach((element) => {
      const div = document.createElement("div");
      div.id = "grafico_proceso_" + element.nombre;
      div.setAttribute("class", "proceso");

      const divNombre = document.createElement("div");
      divNombre.innerHTML = element.nombre;

      div.appendChild(divNombre);

      grafico.appendChild(div);
    });
    const div = document.createElement("div");
    div.id = "grafico_proceso_numeros";
    div.setAttribute("class", "proceso");

    const divNombre = document.createElement("div");
    divNombre.innerHTML = "#";

    div.appendChild(divNombre);

    grafico.appendChild(div);
  }

  eliminarProceso(grafico) {
    while (grafico.firstChild) {
      grafico.removeChild(grafico.firstChild);
    }
  }

  agregarEstado(proceso, tiempo) {
    const divContenedor = document.getElementById(
      "grafico_proceso_" + proceso.nombre
    );

    const divEstado = document.createElement("div");
    divEstado.id = "estado_" + proceso.nombre + "_" + (tiempo + 2);

    divEstado.setAttribute("class", proceso.estado);

    divEstado.setAttribute("style", "grid-column: " + (tiempo + 2) + ";");
    divContenedor.appendChild(divEstado);
    const divContenedorNum = document.getElementById("grafico_proceso_numeros")
    let divNum = document.getElementById("numero_" + tiempo);
    if (divNum) {
    } else {
      divNum = document.createElement("div");
      divNum.id = "numero_" + tiempo;
      divNum.innerHTML = tiempo;
      divNum.setAttribute("style", "grid-column: " + (tiempo + 2) + ";");
      divContenedorNum.appendChild(divNum);
    }
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        console.log("Final:", new Date().getTime(), "inicial", start);
        break;
      }
    }
  }
}

export class Cola {
  constructor() {
    this.contenido = [];
  }
  colaVacia() {
    if (this.contenido.length == 0) {
      return true;
    }
    return false;
  }

  encolar(elemento) {
    this.contenido.push(elemento);
  }

  deencolar() {
    let aux = this.contenido[0];
    this.contenido.splice(0, 1);
    return aux;
  }
}

export class FCFS {
  constructor(listProcesos, grafico) {
    this.listProcesos = listProcesos;
    this.grafico = grafico;
    this.colaEspera = new Cola();
    this.listBloqueo = [];
    this.procesoEje = null;
    this.cpu = new CPU(null, null, null, null, null, null, null);
  }

  ejecutar(tiempo) {
    //Agregar los procesos a la cola de espera cuando lleguen
    this.listProcesos.forEach((element) => {
      if (element.llegada == tiempo) {
        this.colaEspera.encolar(element);
        element.estado = "espera";
      }
    });

    //Colocar los procesos bloqueados en el grafico
    if (this.listBloqueo.length > 0) {
      this.listBloqueo.forEach((element, index) => {
        this.grafico.agregarEstado(element, tiempo);
        element.estadoTiempo.bloqueo++;
      });
    }

    if (this.procesoEje != null) {
      if (this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.ejecucion) {
        this.procesoEje.estado = "final";
        this.colaEspera.deencolar();
        this.procesoEje = null;
      }
    }

    let cont = 0;
    while (true) {
      if (cont < this.colaEspera.contenido.length) {
        if (
          this.procesoEje == null &&
          this.colaEspera.contenido[cont].estado != "bloqueado"
        ) {
          this.procesoEje = this.colaEspera.contenido[cont];
          this.procesoEje.estado = "ejecucion";
          this.procesoEje.estadoTiempo.ejecucion++;
          break;
        }
        if (this.procesoEje != null) {
          this.procesoEje.estadoTiempo.ejecucion++;
          break;
        }
        if (this.colaEspera.contenido[cont].estado == "bloqueado") {
          cont++;
        }
      }
    }

    this.grafico.agregarEstado(this.procesoEje, tiempo);

    //Verificar si el proceso entra a bloqueo
    if (
      this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.bloqueo.inicio
    ) {
      this.procesoEje.estado = "bloqueado";
      this.listBloqueo.push(this.procesoEje);
      this.procesoEje = null;
    }

    //Agregar los espacios de espera y vacios al diagrama
    this.listProcesos.forEach((element) => {
      if (element.estado == "vacio" || element.estado == "espera") {
        this.grafico.agregarEstado(element, tiempo);
      }
    });

    //Verificar si el proceso bloqueado ya termino el bloqueo
    let auxIndex = [];
    this.listBloqueo.forEach((element, index) => {
      if (element.estadoTiempo.bloqueo == element.bloqueo.duracion) {
        auxIndex.push(index);
        element.estado = "espera";
      }
    });
    auxIndex.forEach((element) => {
      this.listBloqueo.splice(element, 1);
    });

    let contFinal = 0;
    this.listProcesos.forEach((element) => {
      if (element.estado != "final") {
        contFinal++;
      }
    });

    /*************************************************************************************************************/
    console.log(
      "Cola",
      JSON.parse(JSON.stringify(this.colaEspera)),
      "lista",
      JSON.parse(JSON.stringify(this.listProcesos))
    );
    /*************************************************************************************************************/

    if (contFinal > 0) {
      return false;
    } else {
      return true;
    }
  }
}
