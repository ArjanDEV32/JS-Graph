import { Graph } from "./graph.js"

function Time(){
  let days = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday","Saturday","Sunday"]
  let res = []
  for(let i = 0; i<30; i++) res.push(`${days[i%days.length]} ${i+1} june 2024`)
  return res
}

let y1 = [], y2 = []
let time = Time()
for(let i =0; i<=time.length-1; i++) {
  y1.push(parseFloat(((i+30)*Math.random()).toFixed("0")))
  y2.push(parseFloat(((i+30)*Math.random()).toFixed("0")))
}

const parent = document.getElementById("parent")

const graph = new Graph({
  parent:parent,
  size:[Math.round(window.innerWidth-50),300],
  graphScaleY:50,
  graphTranslateY:-80,
  lineColor:"rgb(125,125,125)",
  textColorX:"rgb(125,125,125)",
  textColorY:"rgb(125,125,125)",
  fontSizeX:10,
  fontSizeY:10,
  fontFamily:"monospace",
  AngleX: 65,
  StepX:2,
  rightY:true,
  pointSize:5,
  StepY:10, 
  displayY:"$",
  displayFunctionX: function(txt,i){
    let t = txt.split(" ") 
    return `${t[0].slice(0,3)} ${t[1]}` 
  },
  displayFunctionY: function(txt,i){
     
    return txt+"$" 
  },
  X:time,
  Data:[
    {   
      Y: y1,
      showGradient:true,
      showPoints:true,
      lineDash:[1,9],
      lineColor:`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`,
      name:"helloaas",
      lineWidth:5,
    },

    {   
      Y: y2,
      showGradient:true,
      showLastPoint:true,
      lineColor:`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`,
      name:"helloaas",
      lineWidth:5,
    },
  
  ]
})

graph.init()



graph.display.style.boxShadow = "inset 0px -60px 80px rgba(125,125,125,0.1)"
parent.style.left = `${(window.innerWidth - (window.innerWidth-50))/2}px`
parent.style.top = "100px" 
const displayLabel =  document.createElement("div")
displayLabel.style.fontSize = "10px"
displayLabel.style.fontFamily = "Arial"
displayLabel.style.color = "rgb(145,155,155)"
displayLabel.style.backgroundColor = "transparent"
displayLabel.style.position = "absolute"
displayLabel.style.boxShadow = " 0px 0px 5px rgba(125,125,125,0.5)"
displayLabel.style.borderRadius = "5px"
displayLabel.style.top = "50px"
displayLabel.style.display  ="flex"
displayLabel.style.height = "30px"
displayLabel.style.justifyContent = "center"
displayLabel.style.alignItems = "center"
displayLabel.style.whiteSpace = "nowrap"
displayLabel.style.transition = "opacity 300ms"
document.body.appendChild(displayLabel)

graph.displayFG.addEventListener("mouseleave",()=>{
  displayLabel.style.opacity = "0"
})

graph.displayFG.addEventListener("mouseenter",()=>{
  displayLabel.style.opacity = "1"
})


document.addEventListener("graphData",(e)=>{
  let txt = ""
  for(let i = 0; i<e.detail.current.length; i++){
    txt+= `
      ${(`<div style="margin-right:5px; background-color:${e.detail.current[i].color};width:10px; height:10px; border-radius:30px;"></div>`)}
      <p style="margin-right:5px;">${e.detail.current[i].y+graph.displayY}</p>
    `
  }
  txt+=`<p style="margin-right:10px;">|  ${e.detail.current[0].x}</p>`
  
  if(e.detail.second.length>0){ 
    for(let i = 0; i<e.detail.second.length; i++){
      txt+= `
        ${(`<div style="margin-right:5px; background-color:${e.detail.second[i].color};width:10px; height:10px; border-radius:30px;"></div>`)}
        <p style="margin-right:5px;">${e.detail.second[i].y+graph.displayY}</p>
      `
      if(i==e.detail.second.length-1) txt+=`<p style="margin-right:10px;">|  ${e.detail.second[i].x}</p>`
    }
  }
  
  displayLabel.innerHTML = `<div style=" margin-inline:5px; display:flex; justify-content:center; align-items:center;">${txt}</div>`
  let labelPosX =  (e.detail.currentCoords.x+10) - (displayLabel.clientWidth/2)+10
  if(e.detail.currentCoords.x + displayLabel.clientWidth > e.detail.end+30) labelPosX = e.detail.end - displayLabel.clientWidth+10 
  if(e.detail.currentCoords.x - displayLabel.clientWidth < e.detail.begin-30) labelPosX = e.detail.begin+10
  displayLabel.style.transform = `translate(${labelPosX}px, ${e.detail.top + displayLabel.clientHeight-10}px)`
  

})

