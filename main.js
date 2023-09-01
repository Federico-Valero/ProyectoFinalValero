
const Vehiculo=function(marca,modelo,unidades){
    this.marca=marca;
    this.modelo=modelo;
    this.unidades=unidades;
}

//Declaro existencias e inicializo con la informacion que se encuentra en el json
let existencias=[]
async function llenarExistencias(){
  const respuesta= await fetch('/vehiculos.json');
  const resultado= await respuesta.json();
  resultado.forEach(elemento => {
    let vehiculo=new Vehiculo(elemento.marca,elemento.modelo,elemento.unidades)
    existencias.push (vehiculo)
  });
}

localStorage.getItem("Vehiculos")? existencias=JSON.parse(localStorage.getItem("Vehiculos")) : llenarExistencias();



function mostrarUnidades(){
    Swal.fire({
        title:'Ingrese el modelo del que quiere saber las unidades',
        input:'text',
        showCancelButton:true,
        confirmButtonText:'Buscar',
        showLoaderOnConfirm:true,
        preConfirm: (modeloBuscado)=>{
            modeloBuscado=modeloBuscado.trim().toUpperCase()
            let resultado=existencias.filter((modelos)=> modelos.modelo.toUpperCase().includes(modeloBuscado))
            if (resultado.length > 0){
                console.table(resultado)
               
                Swal.fire({
                    title: 'Resultados de búsqueda',
                    html: '<table><tr><th>Marca</th><th>Modelo</th><th>Unidades</th></tr>' +
                          resultado.map(vehiculo => `<tr><td>${vehiculo.marca}</td><td>${vehiculo.modelo}</td><td>${vehiculo.unidades}</td></tr>`).join('') +
                          '</table>',
                          confirmButtonText: 'OK'
                })
                
            } else {
                Swal.fire({
                    title: 'No se encontraron coincidencias',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        
        }
    }
)
}

function agregarModelos(){
    Swal.fire({
        title: "Agregar Modelo",
        html:
          `<label>Marca:</label> <input id="marca-input"  class="swal2-input" type="text" autofocus>

           <label>Modelo:</label><input id="modelo-input" class="swal2-input" type="text" step="0.01">

           <label>Unidades:</label><input id="unidades-input" class="swal2-input" type="number" step="1">`,
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
           let marca= document.getElementById("marca-input").value.trim();
          let modelo = document.getElementById("modelo-input").value.trim();
          let unidades = parseInt(document.getElementById("unidades-input").value);
      
          if (isNaN(unidades) || marca==="" || modelo === "") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ingresar valores validos por favor."
            });
            return;
          }
      
          let vehiculo = new Vehiculo(marca,modelo,unidades);
      
          if (existencias.some((modelos) => modelos.modelo === vehiculo.modelo)) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "El modelo ya existe en la fabrica."
            });
            return;
          }
      
          existencias.push(vehiculo);
      
          Swal.fire({
            icon: "success",
            title: "Modelo agregado",
            text: `Se ha agregado el modelo "${vehiculo.modelo}" a la lista.`,
            timer: 3000
          });
          
          let modelosDiv = document.createElement("div");
          modelosDiv.setAttribute("id", "modelos-div");
          modelosDiv.innerHTML = `<h3>Lista de Modelos en fabrica</h3><ul>${existencias.map(vehiculo => `<li>Marca: ${vehiculo.marca} - Modelo: ${vehiculo.modelo} - Unidades: ${vehiculo.unidades}</li>`).join("")}</ul>`;
          
          Swal.fire({
            title: "Lista de Modelos",
            html: modelosDiv,
            confirmButtonText: "Cerrar"
          });
          localStorage.clear
          let exsjson= JSON.stringify(existencias);
          localStorage.setItem("Vehiculos",exsjson);
        }
      });
}

function quitarModelos(){

    let modelosDiv = document.createElement("div");
          modelosDiv.setAttribute("id", "modelos-div");
          modelosDiv.innerHTML = `<h3>Lista de Modelos en fabrica</h3><ul>${existencias.map(vehiculo => `<li> Marca: ${vehiculo.marca} - Modelo: ${vehiculo.modelo} - Unidades: ${vehiculo.unidades}</li>`).join("")}</ul><h3>Ingrese la fila a eliminar de la lista</h3><input id="eliminav-input"  class="swal2-input" type="number">`;
          Swal.fire({
            title: "Lista de Modelos",
            showCancelButton:true,
            html: modelosDiv,
            confirmButtonText: "Eliminar modelo",
          }).then((result)=>{
          if (result.isConfirmed){
            let filaElminada=document.getElementById("eliminav-input").value -1
            existencias.splice(filaElminada,1)
            let modelosDiv = document.createElement("div");
          modelosDiv.setAttribute("id", "modelos-div");
          modelosDiv.innerHTML = `<h3>Lista de Modelos en fabrica</h3><ul>${existencias.map(vehiculo => `<li>Marca: ${vehiculo.marca} - Modelo: ${vehiculo.modelo} - Unidades: ${vehiculo.unidades}</li>`).join("")}</ul>`;
          
          Swal.fire({
            title: "Lista de Modelos",
            html: modelosDiv,
            confirmButtonText: "Cerrar",
          });
          localStorage.clear;
          let exsjson= JSON.stringify(existencias);
          localStorage.setItem("Vehiculos",exsjson);
          }
        })
}

const mostrarBtn=document.getElementById("mostrarv")
mostrarBtn.addEventListener("click",()=>{mostrarUnidades()})

const agregarBtn=document.getElementById("agregarv")
agregarBtn.addEventListener("click",()=>{agregarModelos()})

const eliminarBtn=document.getElementById("eliminarv")
eliminarBtn.addEventListener("click",()=>{quitarModelos()})