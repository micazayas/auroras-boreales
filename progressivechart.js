// función para crear GRÁFICO CIRCULAR PROGRESIVO. extraída de internet
/* 
Con estos parámetros se puede utilizar la misma función tanto para KP como para probabilidad.
parámetros: 
numero: el valor del kp o la probalibilidad. 
id:  el id del elemento del html donde se ubica el mapa. 
baseCalculo: la base del cálculo siendo para kp 9 y para probabilidad 100. 

 */


function grafico(numero, id, baseCalculo) {

  // siendo la base del calculo 9 ya sabemos que es del KP, define colores. 

  if (baseCalculo == 9) {

    if (numero==0) {

      color="gray"
      
  } else if (numero<4) {
      color="green"
  } else if (numero==4) {
      color="yellow"
  } else if (numero<7) {
      color="orange"
      
  } else {
      color="red"        
  }
    // definir colores de probabilidad
  } else {
    color="blue"
  }

   // settings del gráfico en general. Aca ingresan los parámetros pasados, de esta manera adaptamos el gráfico para lo que necesitemos. 

    const settings = {
        canvasId: id,
        fillAmount: numero,
        baseAmount: baseCalculo,
        fillColor: color,
        baseColor: '#EBF5FB',
        lineWidth: 50,
        fontSize: '80px',
        fontFace: 'Arial'
    }
      
      
      /* ANIMATION STATE
      ************************************************** */
      const state = {
        curAmount: 0,
        curDegrees: 0
      }
      
      
      /* CANVAS
      ************************************************** */
      const canvas = document.getElementById(settings.canvasId)
      canvas.halfWidth = canvas.width / 2
      canvas.halfHeight = canvas.height / 2
      
      const ctx = canvas.getContext('2d')
      
      
      animate()
      
function animate () {
  update()
  draw()
  
  if (state.curAmount < settings.fillAmount) {
    requestAnimationFrame(animate)
  }
}


/* UPDATE
************************************************** */
function update () {




  if (settings.fillAmount !== 0
      ) {
          state.curAmount += 1
          state.curDegrees = (state.curAmount / settings.baseAmount) * 360
      
  }

}


/* DRAW
************************************************** */
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Draw donuts
  drawArc(0, 360, settings.baseColor)
  drawArc(-90, (state.curDegrees - 90), settings.fillColor)
  
  // if para texto interior si es kp muestra kp, si es porcentaje muestra %. 
  if (baseCalculo==9) {
    text= `kp ${state.curAmount}`
    
  } else {
    text= `${state.curAmount} %`
  }

  
  // Draw text amount
  drawText(text)
}

function drawArc (startDegrees, endDegrees, lineColor) { 
  ctx.lineWidth = settings.lineWidth
  ctx.strokeStyle = lineColor
  
  ctx.beginPath()
  ctx.arc(
    canvas.halfWidth,
    canvas.halfHeight,
    // Offset line width to stop trimming at canvas edge
    canvas.halfWidth - (settings.lineWidth / 2),
    degreesToRadians(startDegrees),
    degreesToRadians(endDegrees)
  )
  ctx.stroke()
}

function drawText (text) {
  ctx.fillStyle = settings.fillColor
  ctx.font = 'bold ' + settings.fontSize + ' ' + settings.fontFace
  ctx.textAlign = 'center'
  ctx.fillText(
    text,
    canvas.halfWidth,
    canvas.halfHeight + (parseInt(settings.fontSize) / 3)
  )
}


/* HELPERS
************************************************** */
function degreesToRadians (degrees) {
  return degrees * Math.PI / 180
}
  
      
      
      
    
}

