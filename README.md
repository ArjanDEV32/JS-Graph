# Graphing API in JavaScript

this library is a class that can be used graph any data meant for a single quadrant. (right-top quadrant)

## Usage

```typescript
 class Graph {
  
  parent: htmlElement; //parent element the graph should be in (optional)

  size: array // should be an array of 2 values (width and height)

  graphScaleY: number // scales the graph's height in precentage 

  graphTranslateY: number // moves the graph vertically by any amount

  AngleX: number // angle of x values

  pointSize: number // determines the point size of points

  StepX: number // determines which x values get shown. so if StepX = 2, it will skip every 2 x values  

  StepY: number // determines which y values get shown. so if StepY = 2, it will skip every 2 x values 
  
  lineColor: string // line color of the horizontal lines 

  textColorX: string // text color of the x values

  textColorY: string // text color of the y values 
  
  fontSizeX: string // font size of x values 

  fontSizeY: string // font size of y values 

  fontFamily: string // font family of all the text on the graph 

  name: string // names an eventlistenr on the document

  displayY: string // determines what string comes after every y value
  
  rightY: boolean // determines if the y values will be on the right

  displayFunctionX: function // determines what parts of the text of x values should be displayed or not
  
  X: (string || number) array // the x values that should be displayed
  
  Data: object array // will be the lines that will be displayed on the graph

  // Data should be an array of objects and every object can be a line on the graph
  // example object:
  type object = {   
    Y: array // y values of a line
    showGradient: boolean // shows gradient under a line

    showLastPoint: boolean // shows last point a line 

    lineColor: string // line color of a line

    lineWidth: number // line width
    
    lineDash: number array[2] // line dash
      
    showPoints: boolean // shows all the points on a line
  },
  
}
```

this class also provides a few functions that can be used:

```javascript 
function init()
```
initializes the graph.

```typescript
function updateGraph(data: object)
```
allows you to update the graph by passing a new object with different values.

```typescript
function toImageURL(imagetype: string, quality: number) 
``` 
turns the graph into a base 64 data image url.

in order get access to the graph data you must add an eventlistener to the document with the type of either the name you've given to the graph or the string "graphData".

example:

```javascript
document.addEventListener("graphData", (e)=>{

})
```

``` typescript

  e.detail.current: object array // an array of objects for each line that containes the information of the current point or points your mouse or finger is on.
  //current object:
  type current = {
    
    x: number || string // current x value
     
    y: number // current y value
     
    lineColor: string // current line color
     
    slope: number // current line slope
  }

  
  e.detail.second: object array // similar to current, but its for a second selected point or points
  // on desktop this value would be created if you hold your mouse down on the graph
  // on mobile it will be created if you have a second finger on the graph 
  
  e.detail.currentCoords: object // x and y coordinates of a point or set of points on the graph in px
  e.detail.secondCoords: object // x and y coordinates of a point or set of points on the graph in px

  e.detail.begin: number // begin of the graph in px
  e.detail.end: number // end of the graph in px
  e.detail.top: number // top of the graph in px
  e.detail.bottom: number // bottom of the graph in px
```
