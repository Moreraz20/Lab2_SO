export default class Proceso {
  constructor(nombre, llegada, ejecucion, bloqueo, estado) {
    this.nombre = nombre;
    this.llegada = llegada;
    this.ejecucion = ejecucion;
    this.bloqueo = bloqueo;
    this.estado = estado;
    this.aux = {llegada: llegada, ejecucion: ejecucion, bloqueo: bloqueo};
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
  constructor() {
  }

  crearProceso(listProcesos,grafico) {
    listProcesos.forEach(element => {
      const div = document.createElement("div");
      div.id = "grafico_proceso_" + element.nombre;
      div.setAttribute("class","proceso");

      const divNombre = document.createElement("div");
      divNombre.innerHTML = element.nombre;

      div.appendChild(divNombre);

      grafico.appendChild(div);
    });
  }

  eliminarProceso(grafico) {
    while (grafico.firstChild) {
      grafico.removeChild(grafico.firstChild);
    }
  }

  agregarEstado(proceso,tiempo,estado){
    const divContenedor = document.getElementById("grafico_proceso_"+proceso.nombre);

    const divEstado = document.createElement("div");
    divEstado.id = "estado_"+proceso.nombre+"_"+(tiempo+2)

    divEstado.setAttribute("class",estado);

    divEstado.setAttribute("style","grid-column: "+(tiempo+2)+";")
    divContenedor.appendChild(divEstado);
    /**************************************************************************************************************************/
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
     if ((new Date().getTime() - start) > milliseconds) {
      console.log("Final:",new Date().getTime(),"inicial", start);
      break;
     }
    }
   }
}

export class FCFS {
  constructor(listProcesos,grafico){
    this.listProcesos = listProcesos;
    this.grafico = grafico;
  }

  ejecutar(tiempo){
    this.listProcesos.forEach(element => {
      if(element.llegada == tiempo){
        this.grafico.agregarEstado(element,tiempo,"ejecucion");
      }else{
        this.grafico.agregarEstado(element,tiempo,"vacio");
      }
    });
  }
}
