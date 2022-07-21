export default class Proceso {
  constructor(nombre, llegada, ejecucion, bloqueo, estado) {
    this.nombre = nombre;
    this.llegada = llegada;
    this.ejecucion = ejecucion;
    this.bloqueo = bloqueo;
    this.estado = estado;
    this.estadoTiempo = { ejecucion: 0, bloqueo: 0, dispacher: 0 };
    this.instanteFin = null;
    this.respuesta = null;
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

  agregarGeneral(tabla) {}
}

export class CPU {
  constructor(listaproceso) {
    this.listaproceso = listaproceso;
  }
  construirTabla() {
    const tablaGeneral = document.getElementById("tablaGeneral");
    this.destruirTabla();
    this.listaproceso.forEach((element) => {
      const tr = document.createElement("tr");

      const td = document.createElement("td");
      td.innerHTML = element.nombre;

      const td2 = document.createElement("td");
      td2.innerHTML = element.instanteFin;

      const td3 = document.createElement("td");
      if (element.instanteFin != null) {
        td3.innerHTML = element.instanteFin - element.llegada;
      } else {
        td3.innerHTML = null;
      }

      const td4 = document.createElement("td");
      if (element.instanteFin != null) {
        td4.innerHTML =
          element.instanteFin - element.llegada - element.ejecucion;
      } else {
        td4.innerHTML = null;
      }

      const td5 = document.createElement("td");
      if (element.instanteFin != null) {
        td5.innerHTML =
          (element.instanteFin - element.llegada) / element.ejecucion;
      } else {
        td5.innerHTML = null;
      }

      tr.appendChild(td);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      tablaGeneral.appendChild(tr);
    });
  }

  destruirTabla() {
    const tabla = document.getElementById("tablaGeneral");
    while (tabla.firstChild) {
      tabla.removeChild(tabla.firstChild);
    }
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
    const divContenedorNum = document.getElementById("grafico_proceso_numeros");
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

  agregarDispatcher(tiempo) {
    const contenedorGrafico = document.getElementById("contenedorGrafico");
    const divNum = document.getElementById("grafico_proceso_numeros");
    let contenedor = document.getElementById("grafico_dispatcher");
    if (contenedor) {
    } else {
      contenedor = document.createElement("div");
      contenedor.id = "grafico_dispatcher";
      contenedor.setAttribute("class", "proceso");

      const divNombre = document.createElement("div");
      divNombre.innerHTML = "Dis";

      contenedor.appendChild(divNombre);

      contenedorGrafico.insertBefore(contenedor, divNum);
    }

    let divDispa = document.getElementById("dispacher_" + tiempo);
    if (divDispa) {
    } else {
      divDispa = document.createElement("div");
      divDispa.id = "dispacher_" + tiempo;
      divDispa.setAttribute("class", "dispacher");
      divDispa.setAttribute("style", "grid-column: " + (tiempo + 2) + ";");
      contenedor.appendChild(divDispa);
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

    //Verificar si el proceso ya termino
    if (this.procesoEje != null) {
      if (this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.ejecucion) {
        this.procesoEje.estado = "final";
        this.procesoEje.instanteFin = tiempo;
        let aux = [];
        this.colaEspera.contenido.forEach((element, index) => {
          if (element.estado == "final") {
            aux.push(index);
          }
        });
        aux.forEach((element) => {
          this.colaEspera.contenido.splice(element, 1);
        });
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
      } else {
        break;
      }
    }

    if (this.procesoEje != null) {
      this.grafico.agregarEstado(this.procesoEje, tiempo);

      //Verificar si el proceso entra a bloqueo
      if (
        this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.bloqueo.inicio
      ) {
        this.procesoEje.estado = "bloqueado";
        this.listBloqueo.push(this.procesoEje);
        this.procesoEje = null;
      }
    }

    //Agregar los espacios de espera y vacios al diagrama
    this.listProcesos.forEach((element) => {
      if (
        element.estado == "vacio" ||
        element.estado == "espera" ||
        element.estado == "final"
      ) {
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

    //Verificar cuantos procesos no han finalizado
    let contFinal = 0;
    this.listProcesos.forEach((element) => {
      if (element.estado != "final") {
        contFinal++;
      }
    });

    /*************************************************************************************************************/

    if (contFinal > 0) {
      return false;
    } else {
      return true;
    }
  }
}

export class SJF {
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

    //Verificar si el proceso ya termino
    if (this.procesoEje != null) {
      if (this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.ejecucion) {
        this.procesoEje.estado = "final";
        this.procesoEje.instanteFin = tiempo;
        let aux = [];
        this.colaEspera.contenido.forEach((element, index) => {
          if (element.estado == "final") {
            aux.push(index);
          }
        });
        aux.forEach((element) => {
          this.colaEspera.contenido.splice(element, 1);
        });
        this.procesoEje = null;
      }
    }

    //Se elige elproceso mas corto
    if (!this.colaEspera.colaVacia() && this.procesoEje == null) {
      let auxCont = 0;
      while (
        auxCont < this.colaEspera.contenido.length - 1 &&
        this.colaEspera.contenido[auxCont].estado == "bloqueado"
      ) {
        auxCont++;
      }
      let auxproceso = this.colaEspera.contenido[auxCont];
      if (auxproceso.estado == "espera") {
        this.colaEspera.contenido.forEach((element) => {
          if (
            element.ejecucion < auxproceso.ejecucion &&
            element.estado == "espera"
          ) {
            auxproceso = element;
          }
        });
        this.procesoEje = auxproceso;
        this.procesoEje.estado = "ejecucion";
        this.procesoEje.estadoTiempo.ejecucion++;
      }
    } else {
      if (this.procesoEje != null) {
        this.procesoEje.estadoTiempo.ejecucion++;
      }
    }

    if (this.procesoEje != null) {
      this.grafico.agregarEstado(this.procesoEje, tiempo);

      //Verificar si el proceso entra a bloqueo
      if (
        this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.bloqueo.inicio
      ) {
        this.procesoEje.estado = "bloqueado";
        this.listBloqueo.push(this.procesoEje);
        this.procesoEje = null;
      }
    }

    //Agregar los espacios de espera y vacios al diagrama
    this.listProcesos.forEach((element) => {
      if (
        element.estado == "vacio" ||
        element.estado == "espera" ||
        element.estado == "final"
      ) {
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

    //Verificar cuantos procesos no han finalizado
    let contFinal = 0;
    this.listProcesos.forEach((element) => {
      if (element.estado != "final") {
        contFinal++;
      }
    });

    if (contFinal > 0) {
      return false;
    } else {
      return true;
    }
  }
}

export class SRTF {
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

    //Verificar si el proceso ya termino
    if (this.procesoEje != null) {
      if (this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.ejecucion) {
        this.procesoEje.estado = "final";
        this.procesoEje.instanteFin = tiempo;
        let aux = [];
        this.colaEspera.contenido.forEach((element, index) => {
          if (element.estado == "final") {
            aux.push(index);
          }
        });
        aux.forEach((element) => {
          this.colaEspera.contenido.splice(element, 1);
        });
        this.procesoEje = null;
      }
    }

    //Se elige elproceso mas corto
    if (!this.colaEspera.colaVacia() && this.procesoEje == null) {
      let auxCont = 0;
      while (
        auxCont < this.colaEspera.contenido.length - 1 &&
        this.colaEspera.contenido[auxCont].estado == "bloqueado"
      ) {
        auxCont++;
      }
      let auxproceso = this.colaEspera.contenido[auxCont];
      if (auxproceso.estado == "espera") {
        this.colaEspera.contenido.forEach((element) => {
          if (
            element.ejecucion - element.estadoTiempo.ejecucion <
              auxproceso.ejecucion - auxproceso.estadoTiempo.ejecucion &&
            element.estado == "espera"
          ) {
            auxproceso = element;
          }
        });
        this.procesoEje = auxproceso;
        this.procesoEje.estado = "ejecucion";
        this.procesoEje.estadoTiempo.ejecucion++;
      }
    } else {
      if (this.procesoEje != null) {
        this.procesoEje.estadoTiempo.ejecucion++;
      }
    }

    // let cont = 0;
    // while (true) {
    //   if (cont < this.colaEspera.contenido.length) {
    //     if (
    //       this.procesoEje == null &&
    //       this.colaEspera.contenido[cont].estado != "bloqueado"
    //     ) {
    //       this.procesoEje = this.colaEspera.contenido[cont];
    //       this.procesoEje.estado = "ejecucion";
    //       this.procesoEje.estadoTiempo.ejecucion++;
    //       break;
    //     }
    //     if (this.procesoEje != null) {
    //       this.procesoEje.estadoTiempo.ejecucion++;
    //       break;
    //     }
    //     if (this.colaEspera.contenido[cont].estado == "bloqueado") {
    //       cont++;
    //     }
    //   } else {
    //     break;
    //   }
    // }

    if (this.procesoEje != null) {
      this.grafico.agregarEstado(this.procesoEje, tiempo);

      //Verificar si el proceso entra a bloqueo
      if (
        this.procesoEje.estadoTiempo.ejecucion == this.procesoEje.bloqueo.inicio
      ) {
        this.procesoEje.estado = "bloqueado";
        this.listBloqueo.push(this.procesoEje);
        this.procesoEje = null;
      }
    }

    //Agregar los espacios de espera y vacios al diagrama
    this.listProcesos.forEach((element) => {
      if (
        element.estado == "vacio" ||
        element.estado == "espera" ||
        element.estado == "final"
      ) {
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

    //Verificar cuantos procesos no han finalizado
    let contFinal = 0;
    this.listProcesos.forEach((element) => {
      if (element.estado != "final") {
        contFinal++;
      }
    });

    if (contFinal > 0) {
      return false;
    } else {
      return true;
    }
  }
}

export class RR {
  constructor(listProcesos, grafico, dispacher) {
    this.listProcesos = listProcesos;
    this.grafico = grafico;
    this.colaEspera = new Cola();
    this.listBloqueo = [];
    this.procesoEje = null;
    this.cpu = new CPU(null, null, null, null, null, null, null);
    this.dispacher = { estado: true, total: dispacher };

    const contenedorDispacher = document.getElementById("contenedor_dispacher");
    contenedorDispacher.innerHTML = "Quantum = " + dispacher;

    const buttonDispacher = document.createElement("button");
    buttonDispacher.innerHTML = "Cambiar";
    buttonDispacher.setAttribute("onclick", "cambiarDispacher()");

    contenedorDispacher.appendChild(buttonDispacher);
  }

  ejecutar(tiempo) {
    //Agregar los procesos a la cola de espera cuando lleguen
    this.listProcesos.forEach((element) => {
      if (element.llegada == tiempo) {
        element.estado = "espera";
        this.colaEspera.encolar(element);
      }
    });

    //Colocar los procesos bloqueados en el grafico
    if (this.listBloqueo.length > 0) {
      this.listBloqueo.forEach((element, index) => {
        this.grafico.agregarEstado(element, tiempo);
        element.estadoTiempo.bloqueo++;
      });
    }

    //Verificar si el proceso en iostya de espera ya termino
    this.colaEspera.contenido.forEach((element) => {
      if (element.estadoTiempo.ejecucion >= element.ejecucion) {
        element.estado = "final";
        element.instanteFin = tiempo;
      }
      let aux = [];
      this.colaEspera.contenido.forEach((element2, index) => {
        if (element2.estado == "final") {
          aux.push(index);
        }
      });
      aux.forEach((element2) => {
        this.colaEspera.contenido.splice(element2, 1);
      });
      if (this.procesoEje != null) {
        if (this.procesoEje.nombre == element.nombre) {
          this.procesoEje = null;
        }
      }
    });

    //Verificar si el proceso en ejecucion ya termino
    if (this.procesoEje != null) {
      if (this.procesoEje.estadoTiempo.ejecucion >= this.procesoEje.ejecucion) {
        this.procesoEje.estado = "final";
        this.procesoEje.instanteFin = tiempo;
        this.procesoEje = null;
        this.dispacher.estado = true;
      }
    }

    if (this.procesoEje != null) {
      if (this.procesoEje.estado == "final") {
        this.procesoEje = null;
        this.dispacher.estado = true;
      }
    }

    if (!this.dispacher.estado) {
      while (true) {
        //Asignar un proceso en ejecución
        if (this.procesoEje == null) {
          if (!this.colaEspera.colaVacia()) {
            this.procesoEje = this.colaEspera.deencolar();
            this.procesoEje.estado = "ejecucion";
            this.procesoEje.estadoTiempo.ejecucion++;
            this.procesoEje.estadoTiempo.dispacher++;
          }
          break;
        }
        //Ejecutar el proceso en ejecucion
        if (this.procesoEje != null) {
          this.procesoEje.estadoTiempo.ejecucion++;
          this.procesoEje.estadoTiempo.dispacher++;
          break;
        }
      }
    }

    if (this.procesoEje != null || this.dispacher.estado == true) {
      //Hacer el dispacher
      if (this.dispacher.estado) {
        this.grafico.agregarDispatcher(tiempo);
        this.dispacher.estado = false;
        this.procesoEje = null;
      } else {
        this.grafico.agregarEstado(this.procesoEje, tiempo);
      }

      if (this.procesoEje != null) {
        //Verificar si el proceso entra a bloqueo
        if (
          this.procesoEje.estadoTiempo.ejecucion ==
          this.procesoEje.bloqueo.inicio
        ) {
          this.procesoEje.estado = "bloqueado";
          this.procesoEje.estadoTiempo.dispacher = 0;
          this.listBloqueo.push(this.procesoEje);
          this.procesoEje = null;
          this.dispacher.estado = true;
        }
      }
    }

    //Agregar los espacios de espera y vacios al diagrama
    this.listProcesos.forEach((element) => {
      if (
        element.estado == "vacio" ||
        element.estado == "espera" ||
        element.estado == "final"
      ) {
        this.grafico.agregarEstado(element, tiempo);
      }
    });

    if (this.procesoEje != null) {
      //Verifica si el proceso ya paso el quantum
      if (this.procesoEje.estadoTiempo.dispacher == this.dispacher.total) {
        this.procesoEje.estado = "espera";
        this.procesoEje.estadoTiempo.dispacher = 0;
        this.colaEspera.encolar(this.procesoEje);
        this.procesoEje = null;
        this.dispacher.estado = true;
      }
    }

    //Verificar si el proceso bloqueado ya termino el bloqueo
    let auxIndex = [];
    this.listBloqueo.forEach((element, index) => {
      if (element.estadoTiempo.bloqueo == element.bloqueo.duracion) {
        auxIndex.push(index);
        element.estado = "espera";
        element.estadoTiempo.dispacher = 0;
        this.colaEspera.encolar(element);
      }
    });
    auxIndex.forEach((element) => {
      this.listBloqueo.splice(element, 1);
    });

    //Verificar cuantos procesos no han finalizado
    let contFinal = 0;
    this.listProcesos.forEach((element) => {
      if (element.estado != "final") {
        contFinal++;
      }
    });

    /*************************************************************************************************************/
    console.log("Cola de espera:");
    console.log(JSON.parse(JSON.stringify(this.colaEspera.contenido)));
    /*************************************************************************************************************/

    if (contFinal > 0) {
      return false;
    } else {
      return true;
    }
  }
}
