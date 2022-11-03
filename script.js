// prueba de conexión con github

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

// variables de open weather map // 
const api_key = "8c8666d68069a9c8cd452639cf67f692";
const unidad_temperatura = "metric";

// inicio de funcionalidad 
// evento change para el input de la Ciudad. Se guarda el valor en variable valorCiudad. 
selectCiudad.addEventListener('change', function handleChange(event) {
  console.log(event.target.value);
  valorCiudad = event.target.value
});

// función con expresión regular para determinar que un campo está vacío. 
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

// escucha el boton - chequea el value que no este vacío. 
botonCiudad.addEventListener("click", (e) => {
  console.log("entre al click de una")
  e.preventDefault()
  console.log()
  // chequeo que variable / si está true llamo a funciones
  if (!isBlank(valorCiudad)) {
    console.log(`y mi valor es ${valorCiudad} `)
    asignoValoresLatylong(); // funcion que asigna lat y long
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

// función para asignar valores importantes a partir de la ciudad elegida
// 29/10 - sólo hay dos ciudades - 
function asignoValoresLatylong() {
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
}

// Acá es donde mostramos resultados.
function muestroResultados() {
  // limpiar DIV. 
  resultado.innerHTML = ""
  // muestra temporariamente esto. 
  resultado.innerHTML = `
<p> RESULTADOS LOCAL: La ciudad se llama: ${nombreCiudad}, su value es ${valorCiudad}. Su latitud es ${lat} y su longitud es ${long}  </p>
`
  // llamado a tres funciones que contienen la info: 
  recuperoDatosCiudad(lat, long) // le pega a la API AURORAS
  recuperoDatosClima(lat, long) // le pega a la API CLIMA 
  muestroDatosCiudad() // muestra datos de la API AURORA
  muestraMapaAurora() // muestra imagenes que se cargan del services.swpc.noaa.gov
}

// función para el fetch de AURORAS
function recuperoDatosCiudad(lat, long) {
  fetch(`https://api.auroras.live/v1/?type=all&lat=${lat}&long=${long}&forecast=false&threeday=false&images=true&twentysevenday=true`, {
  })
    // Exito
    .then(res => res.json())  // convertir a json
    .then((json) => {
      console.log(json);
      muestroDatosCiudad(json)
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
      console.log(json);
      muestroDatosClima(json);
    })
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}

// función para mostrar los datos del resultado del fetch AURORAS. 
function muestroDatosCiudad(json) {
  resultadoCiudad.innerHTML = `
    <p> RESULTADO DEL FETCH DE AURORAS 
aca van los datos que vamos a mostrar ${nombreCiudad} ${lat} ${long} </p> 
    `
}

// función para mostrar los datos del resultado del fetch CLIMA 
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

// comentario de prueba para establecer conexión hecho por mica
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