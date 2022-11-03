// variables que se van a usar 

// constantes para obtener elementos del DOM 
const resultado = document.getElementById("resultado");
const resultadoCiudad = document.getElementById("resultadoCiudad")
const selectCiudad = document.getElementById("ciudad");
const botonCiudad = document.getElementById("botonCiudad");
const resultadoCiudadClima = document.getElementById("resultadoCiudadClima")
const mapaAurora = document.getElementById("mapaAurora");


// variables
let valorCiudad;
let data;
let lat;
let long;
let locaciones

// variables de open weather map // 
const api_key = "8c8666d68069a9c8cd452639cf67f692";
const unidad_temperatura = "metric";

// inicio de funcionalidad 

// evento change para el input de la Ciudad. Se guarda el valor en variable valorCiudad. 

// función con expresión regular para determinar que un campo está vacío. 
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

// función para asignar valores importantes a partir de la ciudad elegida
// 29/10 - sólo hay dos ciudades 
//03/10 - esto no será necesario se agregan las opciones de forma programatica

/* function asignoValoresLatylong() {
  console.log(valorCiudad)
  switch (valorCiudad) {
    case "1":
      nombreCiudad = "Fairbanks - Alaska"
      lat = "64.8378";
      long = "-147.716";
      break;
    case "2":
      nombreCiudad = "Whitehorse - Canadá"
      lat = "60.7212";
      long = "-114.42";
      break;
    default:
      lat = null
      long = null
      break;
  }
} */


// Acá es donde mostramos resultados.
function muestroResultados() {
  const { lat, long, description: nombreCiudad, id } = locaciones.find(locacion => locacion.id === valorCiudad)

  // limpiar DIV. 
  resultado.innerHTML = ""

  // muestra temporariamente esto. 
  resultado.innerHTML = `
<p> RESULTADOS LOCAL: La ciudad se llama: ${nombreCiudad}, su value es ${id}. Su latitud es ${lat} y su longitud es ${long}  </p>
`
  // llamado a tres funciones que contienen la info: 
  recuperoDatosCiudad(lat, long) // le pega a la API AURORAS
  recuperoDatosClima(lat, long) // le pega a la API CLIMA 
  /* muestroDatosCiudad() */ // muestra datos de la API AURORA
  muestraMapaAurora() // muestra imagenes que se cargan del services.swpc.noaa.gov

}

// función para el fetch de AURORAS, vamos a extraer los datos de OVATION Aurora Model del NOAA
function recuperoDatosCiudad(lat, long) {

  fetch(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`, {
  })

    // Exito
    .then(res => res.json())  // convertir a json
    .then((json) => {

      const coordenadas = json.coordinates

      const auroras = coordenadas.flatMap(coordenada => parseInt((coordenada[2])))

      const maxLocation = coordenadas.filter(coordenada => coordenada[2] === 42)
      console.log(maxLocation)
      const locationData = coordenadas.filter(coordenada => coordenada[0] === parseInt(long) + 180 && coordenada[1] === parseInt(lat)) //se adicionan 180 para que coinicidan las metricas del servicio meteoroligico espacioal con las metricas de auroras.live 

      muestroDatosCiudad(locationData?.length ? locationData[0][2] : null)
    })
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}

// función para el fetch de CLIMA 

function recuperoDatosClima(lat, long) {

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=${unidad_temperatura}`
    , {
    })

    // Exito
    .then(res => res.json())  // convertir a json
    .then((json) => {

      muestroDatosClima(json);

    })
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores


}

// función para mostrar los datos del resultado del fetch AURORAS. Se hace un barra de gradientes que luego se podrá a animar segun las resultados para darle dinamismo... la info de probabilidad se saca de la web del NOAA... Atención hay que chequear si realmente el avotion es la probabilidad

function muestroDatosCiudad(probabilidad) {
  console.log("probabilidad es igual a " + probabilidad)

  let color = ""

  if (probabilidad === 0) {
    color = "white"
  } else if (probabilidad <= 9) {
    color = "grey"
  } else if (probabilidad <= 29) {
    color = "green"
  } else if (probabilidad <= 49) {
    color = "orange"
  } else {
    color = "red"
  }
  console.log(color)
  const div = document.createElement("div")

  div.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(212,212,212,1) 4%, rgba(130,228,83,1) 18%, rgba(220,154,61,1) 35%, rgba(255,0,0,1) 100%)"
  div.style.border = "solid 1px black"
  div.style.width = "500px"
  div.style.height = "50px"
  resultadoCiudad.innerHTML = `<p>La probabilidad es igual a ${probabilidad}</p>`
  resultadoCiudad.appendChild(div)

}

// función para mostrar los datos del resultado del fetch CLIMA, no se toca esta función

function muestroDatosClima(data) {

  const {
    name,
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { deg, speed },
    weather: [array],
    coord: { lon, lat },
  } = data;

  resultadoCiudadClima.innerHTML = `
    <p>
    RESULTADO FETCH CLIMA:  clima de la Ciudad de ${data.name} su temperatura es de ${data.main.temp}  su longitud es ${data.coord.lon} y su latitud es ${data.coord.lat}
  </p>`

}

// función para mostrar probabilidad de auroras en hemisferio norte y hermisferio sur. Fuente: services.swpc.noaa.gov - Modelo Ovation Aurora Model - Esto es fijo sin importar las latitudes que se ingresen. Aún por averiguar cada cuanto el servicio refresca la imagen creo que cada una hora. 

function muestraMapaAurora() {

  mapaAurora.innerHTML = ` 
    <div>
  <div class="row">
  <div class="fs-6 fw-bold">Estos mapas muestran la posición estimada del óvalo del Aurora Model. Son imágenes procesadas por un software del Space Weather Prediction Center, se actualizan cada xx completar.</div>
    <div class="col-lg-6">
      <img
        src="https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg"
        alt=" Auroras hemisferio sur  "
        class="w-100  mb-2 mb-md-4 shadow-1-strong rounded"
      />
    </div>
    <div class="col-lg-6">
      <img
        src="https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg"
        alt="auroras hemisferio norte"
        class="w-100 shadow-1-strong rounded"
      />
    </div>
  </div>
</div>
    `
}

// Reemplazo el innerHTML con las dos ciudades iniciales para añadir opciones de forma programática (las 16 ubicaciones de la API Aurolas Live)

function traerLocaciones() {
  fetch("https://api.auroras.live/v1/?type=locations").then(response => response.json()).then(data => {
    const dataArray = Object.keys(data).map(key => data[key])
    locaciones = dataArray;
    renderizarLocaciones(dataArray)
    addEventListeners()
  }).catch(error => console.log(error))
}

function renderizarLocaciones(locaciones) {
  selectCiudad.innerHTML = '<option value="">Seleccione una ubicación</option>';

  for (const locacion of locaciones) {

    if (locacion === "message") {
      continue;
    }

    const elementoHTML = obtenerPlantillaHTMLLocaciones(locacion);
    selectCiudad.innerHTML += elementoHTML;
  }
}

function obtenerPlantillaHTMLLocaciones(locacion) {
  return `<option value="${locacion.id}">${locacion.description}</option>`
}

// I write it at the end because I am working with global variables, I need the info previously loaded... mica
function addEventListeners() {

  selectCiudad.addEventListener('change', function handleChange(event) {
    console.log(event.target.value);
    valorCiudad = event.target.value
  });

// escucha el boton - chequea el value que no este vacío. 

  botonCiudad.addEventListener("click", (e) => {
    console.log("entre al click de una")
    e.preventDefault()
    console.log()
    // chequeo que variable / si está true llamo a funciones
    if (!isBlank(valorCiudad)) {
      console.log(`y mi valor es ${valorCiudad} `)
      /* asignoValoresLatylong(); */ // funcion que asigna lat y long
      muestroResultados()
      // si es false, es porque no se seleccionó ciudad. 
    } else {
      resultadoCiudad.innerHTML = "";
      mapaAurora.innerHTML = "";
      resultadoCiudadClima.innerHTML = "";
      resultado.innerHTML = `
        <p class="alert alert-danger" role="alert">Por favor seleccione una Ciudad</p>`
    }
  })
}

traerLocaciones()