// variables que se van a usar 
// constantes para obtener elementos del DOM 
const resultado = document.getElementById("resultado");
const resultadoCiudad = document.getElementById("resultadoCiudad")
const form = document.querySelector("form");
const input = document.getElementById("input_ciudad");
const botonCiudad = document.getElementById("botonCiudad");
const resultadoCiudadClima = document.getElementById("resultadoCiudadClima")
const mapaAurora = document.getElementById("mapaAurora");


// variables
let valorCiudad;
let data;
let latitud;
let longitud;
let locaciones

// variables de open weather map // 
const api_key = "8c8666d68069a9c8cd452639cf67f692";
const unidad_temperatura = "metric";

// inicio de funcionalidad 

// función con expresión regular para determinar que un campo está vacío. - ver si la usamos
/* function isBlank(str) {
  return (!str || /^\s*$/.test(str));
} */

// función validar Ciudad que no esté vacía y que no sea número

function validarCiudad() {

  if (input.value !== "" && isNaN(input.value)) {
    valorCiudad = input.value;
    form.reset();

    console.log(valorCiudad);

  }
}

// escucho evento click

botonCiudad.addEventListener("click", (e) => {

  e.preventDefault()

  validarCiudad()
  llamadaClima(valorCiudad)

})

// llamada api clima 

function llamadaClima(valorCiudad) {

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${valorCiudad}&appid=${api_key}&units=${unidad_temperatura}`
  )
    .then((resp) => {

      if (!resp.ok) throw Error(resp.status)

      return resp
    })

    .then(res => res.json())

    .then((json) => {
      recuperoDatosClima(json);
      console.log(json)

    })
    // se agarra el error en la solicitud por si algo sale mal.
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}


// recupero datos del clima - faltan usar - por ahora solo lat y long 

function recuperoDatosClima(data) {
  const {
    name,
    dt,
    timezone,
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { deg, speed },
    weather: [array],
    coord: { lon, lat },
  } = data;

  // chequea info de lat y lon. Es vital para que todo funcione
  console.log(data.coord.lon)
  console.log(data.coord.lat)
  console.log(data.dt)
  console.log(data.timezone)
  console.log(new Date(data.dt * 1000 + (data.timezone * 1000)))
  console.log(new Date(data.dt * 1000 - (data.timezone * 1000)));
  const hoy = new Date()
  hora = moment(data.dt).utcOffset(data.timezone).format('YYYY-MM-DD HH:mm')
  console.log(hoy)
  console.log(hora)


  // utilizo la lat y long para el resto de las solicitudes. 



  // llama a la api aurora para obtener kp con parámetros de long y lat de api clima 
  llamadaKp(data.coord.lat, data.coord.lon)

  // llama a datos de services spacial weather se le pasa lat y long 
  probabilidadAuroras(data.coord.lat, data.coord.lon)

  // llama a función para mostrar clima pasa data como parámetro
  muestroDatosClima(data)

}

// llama a api auroras live 
function llamadaKp(lat, long) {

  fetch(
    `https://api.auroras.live/v1/?type=all&lat=${lat}&long=${long}&forecast=false&threeday=false`
  )
    .then((resp) => {

      // desarrollar manejo de errores. sobre todo 404. 
      if (!resp.ok) throw Error(resp.status)
      return resp
    })

    .then(res => res.json())

    .then((json) => {
      muestroDatosKp(json);

    })
    // se agarra el error en la solicitud por si algo sale mal.
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}


// muestra KP 

function muestroDatosKp(json) {

  console.log(json)
  console.log(json.ace.kp)
  console.log(json.date)

  grafico(json.ace.kp, "canvas", 9);
  grafico(json.ace.kp1hour, "canvas2", 9);
  //grafico(json.ace.kp4hour, "canvas3", 9)


}


// muestra clima. 

function muestroDatosClima(data) {

  console.log(new Date(data.dt * 1000 - (data.timezone * 1000))); // minus 

  resultadoCiudadClima.innerHTML = `
        <p>
        RESULTADO FETCH CLIMA:  clima de la Ciudad de ${data.name} su temperatura es de ${data.main.temp}  su longitud es ${data.coord.lon}  y su latitud es ${data.coord.lat} horario: 
      </p>`


}



// función para el fetch de AURORAS
function probabilidadAuroras(lat, long) {

  fetch(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`, {
  })

    // Exito
    .then(res => res.json())  // convertir a json
    .then((json) => {
      console.log(json)
      const coordenadas = json.coordinates
      console.log(coordenadas)

      const auroras = coordenadas.flatMap(coordenada => parseInt((coordenada[2])))
      console.log(auroras)



      const maxLocation = coordenadas.filter(coordenada => coordenada[2] === 42)
      console.log(maxLocation)
      const locationData = coordenadas.filter(coordenada => coordenada[0] === parseInt(long) + 180 && coordenada[1] === parseInt(lat))

      muestroDatosCiudad(locationData?.length ? locationData[0][2] : null)


    })
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores

}

function muestroDatosCiudad(probabilidad) {
  console.log("probabilidad es igual a " + probabilidad)

  grafico(probabilidad, "canvas4", 100)


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


