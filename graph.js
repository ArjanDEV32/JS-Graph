"use strict"


export class Graph{
  constructor(props){
    this.Data = props.Data
    this.size = props.size 
    this.parent = props.parent
    this.fontFamily = props.fontFamily || "Arial"
    this.textColor = props.textColor || "rgb(90,90,90)"
    this.lineColor = props.lineColor || "rgb(125,125,125)"
    this.fontSizeX = props.fontSizeX*window.devicePixelRatio || 10*window.devicePixelRatio  
    this.fontSizeY = props.fontSizeY*window.devicePixelRatio || 10*window.devicePixelRatio
    this.X = props.X
    this.rightY = props.rightY || false
    this.AngleX = props.AngleX
    this.StepX = props.StepX
    this.StepY = props.StepY
    this.textColorX = props.textColorX
    this.textColorY = props.textColorY
    this.displayY = props.displayY
    this.displayFunctionX = props.displayFunctionX
    this.graphScaleY = props.graphScaleY
    this.graphTranslateY = props.graphTranslateY
    this.pointSize = props.pointSize||4
    this.name = props.name||"graphData"
  }
  displayCont =  document.createElement("div")
  display = document.createElement("canvas")
  displayFG = document.createElement("canvas")
  displayBG = document.createElement("img")
  Gradient = document.createElement("canvas")
  displayBG2 = document.createElement("canvas")
  displayCTX = this.display.getContext("2d")
  displayFG_CTX = this.displayFG.getContext("2d")
  GradientCTX = this.Gradient.getContext("2d")
  displayBG2_CTX = this.displayBG2.getContext("2d")
  Top = 0; Bottom = 0; Begin=0; End=0;
  YMax = 0; YMin = 0; 
  DataMap = {}
  
  scaleY = 0; translateY = 0; downY = 0;posY = 0
  LabelColor ="lime"
  Flags={MouseDownOnDisplay:false,MouseOnDisplay:false,F:false,}
  ICPX = 0 

  #Touches = {}
  #D = 0
  #hasStarted = 0
  #onMobile = 0

  #displaySetup(){
    this.displayCont.appendChild(this.display)
    this.displayCont.appendChild(this.displayFG)
    this.displayCont.appendChild(this.displayBG2)
    this.displayCont.appendChild(this.displayBG)
  
    if(this.parent!=undefined) this.parent.appendChild(this.displayCont)
    else document.body.appendChild(this.displayCont)

    this.display.width = this.size[0] * window.devicePixelRatio
    this.display.height = this.size[1] * window.devicePixelRatio
    this.display.style.width = `${this.size[0]}px`
    this.display.style.height = `${this.size[1]}px`
    this.display.style.borderRadius = "5px"
    this.display.style.position = "absolute"
    this.display.style.zIndex = "1"
    this.display.style.imageRendering = "pixelated"
   
    this.displayFG.width = this.size[0] * window.devicePixelRatio
    this.displayFG.height = this.size[1] * window.devicePixelRatio
    this.displayFG.style.width = `${this.size[0]}px`
    this.displayFG.style.height = `${this.size[1]}px`
    this.displayFG.style.borderRadius = "5px"
    this.displayFG.style.cursor = "pointer"
    this.displayFG.style.position = "absolute"
    this.displayFG.style.zIndex = "2"
    this.displayFG.style.transition = "opacity 1000ms"
    this.displayFG.style.opacity = "0"
    
    this.Gradient.width = this.size[0] * window.devicePixelRatio
    this.Gradient.height = this.size[1] * window.devicePixelRatio
    this.Gradient.style.width = `${this.size[0]}px`
    this.Gradient.style.height = `${this.size[1]}px`
    this.Gradient.style.imageRendering = "pixelated"

    this.displayBG.width = this.size[0]
    this.displayBG.height = this.size[1]
    this.displayBG.style.width = `${this.size[0]}px`
    this.displayBG.style.height = `${this.size[1]}px`
    this.displayBG.style.position = "absolute"
    this.displayBG.style.zIndex = "1"
    this.displayBG.style.border = "none"
    this.displayBG.style.userSelect = "none"
    
    this.displayBG2.width = this.size[0] * window.devicePixelRatio
    this.displayBG2.height = this.size[1] * window.devicePixelRatio
    this.displayBG2.style.width = `${this.size[0]}px`
    this.displayBG2.style.height = `${this.size[1]}px`
    this.displayBG2.style.borderRadius = "5px"
    this.displayBG2.style.position = "absolute"
    this.displayBG2.style.zIndex = "0"
    this.displayBG2.style.imageRendering = "pixelated"
  }
  

  #drawLine(x1,y1,x2,y2,lw,ss,ld,ctx){
    ctx.lineWidth = lw
    ctx.strokeStyle = ss
    ctx.beginPath()
    ctx.setLineDash(ld)
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  #drawPoint(x,y,r,fs,ctx){
    ctx.beginPath()
    ctx.fillStyle = fs
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
  }

  #withinRange(x){
    if(this.DataMap[x]!=undefined) return [true,x]
    for(let i = 0; i<=this.#D; i++) if(this.DataMap[x+i]!=undefined) return [true,x+i]
    for(let i = 0; i<=this.#D; i++) if(this.DataMap[x-i]!=undefined) return [true,x-i]
    return [false,x]
  } 

  #graphSetup(Data,bounds){

    let plotX1, plotY1
    let plotX2, plotY2
    let lw, ss, ld
    let YMax = bounds[0] 
    let XMax = this.X.length-1
    let txt = ""
    let slope = Data.Y[Data.Y.length-1] > Data.Y[0] ? 1 : 0
    this.LabelColor = slope ? "lime" : "rgb(255, 100, 100)"
   
    const setUpX = (x,y,i)=>{
      if(Data.Y[i]!=undefined){
        if(this.StepX!= undefined && i%this.StepX == 0){
          this.#drawLine(x,y,x,this.Bottom,0.2,this.lineColor,[1,3],this.displayCTX)
          txt = `${this.displayFunctionX(this.X[i], i)}`      
          this.displayBG2_CTX.save()
          this.displayBG2_CTX.translate(x-(txt.length),this.Bottom+20);
          this.displayBG2_CTX.rotate(((this.AngleX||0)*Math.PI) / 180)
          this.displayBG2_CTX.fillText(txt,0,0)
          this.displayBG2_CTX.restore()
          this.#drawLine(x,this.Bottom,x,this.Bottom+9,0.2,this.lineColor,[],this.displayCTX)
        }
        if(this.DataMap[x]==undefined) this.DataMap[x] = [{x:this.X[i], y:Data.Y[i], color:Data.lineColor,slope:slope,YMax:YMax}] 
        else this.DataMap[x].push({x:this.X[i], y:Data.Y[i], color:Data.lineColor,slope:slope, YMax:YMax}) 
      }
    }

    plotX1 = Math.round((this.Begin+((0/XMax) * (this.End-(this.Begin*2)))))
    plotY1 = Math.round((this.display.height - ((Data.Y[0]/YMax) *(this.display.height-this.scaleY)))+this.translateY)
    this.#D = Math.round((this.Begin+((0/XMax) * (this.End-(this.Begin*2)))))
    this.GradientCTX.beginPath()
    this.GradientCTX.moveTo(plotX1,plotY1)

    this.displayCTX.lineCap = "round"
    lw = Data.lineWidth||1
    ss = slope ? (Data.lineColor||"#84c284") : (Data.lineColor||"#db4f40")
    ld = Data.lineDash!=undefined?Data.lineDash:[]
 
    for(let i = 0; i<=this.X.length-2 && Data.Y[i]!=undefined; i++){
      plotX1 = Math.round((this.Begin+((i/XMax) * (this.End-(this.Begin)))))
      plotY1 = Math.round((this.display.height - ((Data.Y[i]/YMax) *(this.display.height-this.scaleY)))+this.translateY)
      plotX2 = Math.round((this.Begin+(((i+1)/XMax) * (this.End-(this.Begin)))))
      plotY2 = Math.round((this.display.height - ((Data.Y[i+1]/YMax) * (this.display.height-this.scaleY)))+this.translateY)

      this.#drawLine(plotX1,plotY1,plotX2,plotY2,lw,ss,ld,this.displayCTX)
      if(Data.showPoints) this.#drawPoint(plotX1,plotY1,this.pointSize,ss,this.displayCTX)
      this.GradientCTX.lineTo(plotX2,plotY2)
      setUpX(plotX1,plotY1,i)   
    } 

    if(Data.showPoints || Data.showLastPoint) this.#drawPoint(plotX2,plotY2,this.pointSize,ss,this.displayCTX)
    let l = this.X.length - 1
    setUpX(plotX2,plotY2,l)

    let gradient = 0
    plotX1 = (this.Begin+(((0)/XMax) * (this.End-(this.Begin*2))))
    gradient = this.GradientCTX.createLinearGradient(plotX2,this.Top,plotX2,this.Bottom)

    let ce = document.createElement("div")
    document.body.appendChild(ce)
    ce.style.color = slope > 0 ? (Data.lineColor||"#75d162") : (Data.lineColor||"red")
    let c = window.getComputedStyle(ce).color.split(",")
    let a = [parseInt(c[0].split("(")[1]),parseInt(c[1]),parseInt(c[2]),parseFloat(c[3]||1)]
    gradient.addColorStop(0, `rgba(${a[0]},${a[1]},${a[2]},${a[3]})`)
    gradient.addColorStop(0.3,`rgba(${a[0]},${a[1]},${a[2]},0.5)`)
    gradient.addColorStop(0.8,`rgba(${a[0]},${a[1]},${a[2]},0.1)`)
    gradient.addColorStop(1,"transparent")
    document.body.removeChild(ce)
   
    this.GradientCTX.fillStyle = gradient 
    this.GradientCTX.lineTo(plotX2,this.Bottom)
    this.GradientCTX.lineTo(plotX1,this.Bottom)
    if(Data.showGradient) this.GradientCTX.fill()
    this.displayBG.src = this.Gradient.toDataURL()
    
  }

  init(){
    if(this.Data!=undefined){

      if(!this.#hasStarted) this.#displaySetup()
      this.scaleY = this.size[1] * ((100 - Math.min(this.graphScaleY,100)) / 100) * window.devicePixelRatio 
      this.translateY = this.graphTranslateY*window.devicePixelRatio
    
      let Y = 0
      let TotalValues
      let bounds =[]
      for(const graph of this.Data){
        this.YMax = Math.max(Math.max(...graph.Y),this.YMax)
        this.YMin = Math.min(Math.min(...graph.Y),this.YMin)
        bounds.push([this.YMax,this.YMin])
        TotalValues+= graph.Y.length
      }

      this.Bottom = ((this.display.height - ((this.YMin/this.YMax) * (this.display.height-this.scaleY)))+this.translateY)
      this.Top = ((this.display.height - ((this.YMax/this.YMax) * (this.display.height-this.scaleY)))+this.translateY)
      this.Begin = `${this.StepY*TotalValues}${this.displayY}`.length * (this.fontSizeY/2) + 10
      this.End = this.display.width-20
      if(this.rightY){
        this.End = (this.display.width-20) - this.Begin 
        this.Begin = 20
      }
      
      this.displayBG2_CTX.font = `${this.fontSizeX}px ${this.fontFamily}`
      this.displayBG2_CTX.fillStyle = this.textColorY
      this.displayCTX.font = `${this.fontSizeY}px ${this.fontFamily}`
      
      if(this.StepY!=undefined){ 
        for(let i = 0; i==i; i+=this.StepY){ 
          Y = Math.round((this.display.height - ((i/this.YMax) * (this.display.height-this.scaleY)))+this.translateY)
          if(i>this.YMin){ 
            this.displayCTX.fillStyle = this.textColorY
            this.displayCTX.fillText(`${i}${this.displayY}`, this.rightY?this.End+10:5, Y+2.5 )
            this.#drawLine(this.Begin,Y,this.End,Y,0.2,this.lineColor,[],this.displayCTX)
          }
          if(i>this.YMax) {
            this.Top = ((this.display.height - ((i/this.YMax) *(this.display.height-this.scaleY)))+this.translateY) 
            break  
          }
        }
      }
     
      this.#drawLine(this.Begin, this.Bottom, this.End, this.Bottom,1,this.lineColor,[],this.displayCTX) 
      for(let i =0; i<this.Data.length; i++) this.#graphSetup(this.Data[i],bounds[i])

      if(!this.#hasStarted){ 
        this.displayFG.addEventListener("pointerup", ()=>{this.#Touches = {}})
        this.displayFG.addEventListener("touchstart", (e)=>{e.preventDefault();return false})
        this.displayFG.addEventListener("mouseenter", ()=>{this.displayFG.style.opacity = "1", this.Flags.MouseOnDisplay = true})
        this.displayFG.addEventListener("mouseleave", ()=>{
          this.Flags.MouseOnDisplay = false
          if(!this.Flags.MouseDownOnDisplay){ 
            this.displayFG.style.opacity = "0"
            this.displayBG.style.clipPath = `rect(0px ${this.displayBG.clientWidth}px ${this.displayBG.clientHeight}px 0px)`
          }
        })
        document.addEventListener("mousedown", ()=>{if(this.Flags.MouseOnDisplay) this.Flags.MouseDownOnDisplay=true, this.Flags.F = true, this.displayFG.style.cursor = "grabbing"})
        document.addEventListener("mouseup", ()=>{this.Flags.MouseDownOnDisplay=false, this.displayFG.style.cursor = "pointer"})
        this.displayFG.addEventListener("pointerdown", (e)=>{
          if(e.pointerType!="mouse") this.#Touches[e.pointerId] = e.offsetX, this.#showGraphDataTouch(e), this.displayFG.style.opacity = "1"
        })
        document.addEventListener("mousemove", (e)=>{if(this.Flags.MouseOnDisplay||this.Flags.MouseDownOnDisplay) this.#showGraphDataMouse(e)})
        this.displayFG.addEventListener("pointermove", (e)=>{if(e.pointerType!="mouse") this.#showGraphDataTouch(e)})
      }
      this.#hasStarted = 1
      this.GradientCTX.clearRect(0,0,this.Gradient.width,this.Gradient.height)
    } 
  }

  
  #showGraphDataTouch(e){

    let r =this.#withinRange(e.offsetX*2) 
    if(r[0]){
      let touch1 = [], touch2 = [], touches = [], x = r[1], touch1Co, touch2Co
      this.displayFG_CTX.clearRect(0,0,this.display.width,this.display.height)
      this.#Touches[e.pointerId] = x/2
      for(const id in this.#Touches){ 
        touches.push(this.#Touches[id]) 
        
        this.#drawLine(this.#Touches[id]*2,this.Top,this.#Touches[id]*2,this.Bottom,3,this.lineColor,[3,6],this.displayFG_CTX)
        for(const point of this.DataMap[this.#Touches[id]*2]){
          this.posY = Math.round(this.display.height - (point.y / point.YMax) * (this.display.height - this.scaleY) + this.translateY)
          this.#drawPoint(this.#Touches[id]*2,this.posY,this.pointSize,(point.color||this.LabelColor), this.displayFG_CTX)
          if(touches.length==1){
            touch1Co = {x:this.#Touches[id],y:this.posY}
            touch1.push(point)
          }
          if(touches.length==2){
           touch2Co = {x:this.#Touches[id],y:this.posY}
            touch2.push(point)
          }
        } 
      }

      if(touches.length==2) this.displayBG.style.clipPath = `rect(0px ${Math.max(touches[0],touches[1])}px ${this.displayBG.clientHeight}px ${Math.min(touches[0],touches[1])}px)`
      else  this.displayBG.style.clipPath = `rect(0px ${this.displayBG.clientWidth}px ${this.displayBG.clientHeight}px 0px)` 

      let Event = new CustomEvent(`${this.name}`, {
        detail:{
          Event:e,
          currentCoords:touch1Co,
          sencondCoords:touch2Co,
          current:touch1,
          second:touch2,
          begin:this.Begin/2,
          end:this.End/2,
          top:this.Top/2,
          bottom:this.Bottom/2,
        }
      })
      document.dispatchEvent(Event)
    }
  }

  #showGraphDataMouse(e){
    let r =this.#withinRange(e.offsetX) 
    if(r[0]){
      let p1 = [], p2 = [], x = r[1]
      this.displayFG_CTX.clearRect(0,0,this.display.width,this.display.height)
      this.#drawLine(x,this.Top,x,this.Bottom,2,this.lineColor,[1,3],this.displayFG_CTX)
      for(const point of this.DataMap[x]){
        this.posY = Math.round(this.display.height - (point.y / point.YMax) * (this.display.height - this.scaleY) + this.translateY)
        this.#drawPoint(x,this.posY,this.pointSize,(point.color||this.LabelColor),this.displayFG_CTX)
        p1.push(point)

      }
    
      if (this.Flags.MouseDownOnDisplay) {
        if (this.Flags.F) this.ICPX = x
        this.Flags.F = false
        this.#drawLine(this.ICPX,this.Top,this.ICPX,this.Bottom,2,this.lineColor,[1,3],this.displayFG_CTX)
        for(let i = 0; i<this.DataMap[this.ICPX].length; i++){ 
          this.downY = Math.round(this.display.height - (this.DataMap[this.ICPX][i].y / this.YMax) * (this.display.height - this.scaleY) + this.translateY)
          this.#drawPoint(this.ICPX, this.downY,this.pointSize,(this.DataMap[this.ICPX][i].color||this.LabelColor),this.displayFG_CTX)
          p2.push(this.DataMap[this.ICPX][i])
        }
        this.displayBG.style.clipPath = `rect(0px ${Math.max(this.ICPX,x)}px ${this.displayBG.clientHeight}px ${Math.min(this.ICPX,x)}px)`
      } else  this.displayBG.style.clipPath = `rect(0px ${this.displayBG.clientWidth}px ${this.displayBG.clientHeight}px 0px)`
      
      let Event = new CustomEvent(`${this.name}`, {
        detail:{
          Event:e,
          currentCoords:{x:x,y:this.posY},
          sencondCoords:this.Flags.MouseDownOnDisplay?{x:this.ICPX,y:this.downY}:undefined,
          current:p1,
          second:p2,
          begin:this.Begin,
          end:this.End,
          top:this.Top,
          bottom:this.Bottom
        }
      })
      document.dispatchEvent(Event)
    }
  }

  updateGraph(Data){

    this.displayCTX.clearRect(0,0,this.display.width,this.display.height)
    this.GradientCTX.clearRect(0,0,this.display.width,this.display.height)
    this.displayBG2_CTX.clearRect(0,0,this.display.width,this.display.height)

    this.graphScaleY = Data.graphScaleY||this.graphScaleY
    this.graphTranslateY = Data.graphTranslateY||this.graphTranslateY,
    this.lineColor = Data.lineColor||this.lineColor
    this.textColorX = Data.textColorX||this.textColorX
    this.textColorY = Data.textColorY||this.textColorY
    this.fontSizeX = Data.fontSizeX||this.fontSizeX
    this.fontSizeY = Data.fontSizeY||this.fontSizeY
    this.fontFamily = Data.fontFamily||this.fontFamily
    this.fixedLabelDisplay = Data.fixedLabelDisplay||this.fixedLabelDisplay
    this.AngleX =  Data.AngleX||this.AngleX
    this.StepX = Data.StepX||this.StepX
    this.pointSize = Data.pointSize||this.pointSize
    this.StepY = Data.StepY||this.StepY 
    this.displayY  = Data.displayY||this.displayY
    this.displayFunctionX = Data.displayFunctionX||this.displayFunctionX 
    this.X =Data.X||this.X
    this.rightY = Data.rightY||this.rightY
    this.Data = Data.Data||this.Data
    this.DataMap = {}
    C.init()
  }

  /**
   * @param {string} type image extension type. example: .jp, .png, .webp
   * @param {number} quality image quality
   * @returns base 64 data image url 
   */
  toImageURL(type,quality){
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    canvas.width = this.display.width
    canvas.height = this.display.height
    ctx.drawImage(this.Gradient,0,0)
    ctx.drawImage(this.displayBG2,0,0)
    ctx.drawImage(this.display,0,0)
    return canvas.toDataURL(`image/${type=="png"?"png":type=="webp"?"webp":"jpeg"}`,quality||1)
  }
}