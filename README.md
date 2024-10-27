# Graphing API in JavaScript

this library is a class that can be used graph any data meant for a single quadrant.

## Usage
```javascript

/**@type {class}*/
const graph = new Graph({
  
  /**@type {HTMLelement}*/
  parent //parent element the graph should be in (optional) 

  /**@type {int array[2]}*/
  size // should be an array of 2 values (width and height)

  /**@type {number}*/:{ 
    graphScaleY // scales the graph's height in precentage 

    graphTranslateY // moves the graph vertically by any amount

    AngleX // angle of x values

    pointSize // determines the point size of points

    StepX: /** determines which x values get shown.
    so if StepX = 2; every x value divisable by 2 will be shown on the graph */

    StepY // determines which y values get shown
    // so if StepY = 2, every y value divisable by 2 will be shown on the graph
  }
  

  /**@type {string}*/:{ 
    lineColor // line color of the horizontal lines 
  
    textColorX // text color of the x values

    textColorY // text color of the y values 
    
    fontSizeX // font size of x values 
  
    fontSizeY // font size of y values 
  
    fontFamily // font family of all the text on the graph 

    name // names an eventlistenr on the document

    displayY // determines what string comes after every y value
  }

  /**@type {boolean}*/
   rightY // determines if the y values will be on the right

  /**@type {callback function}*/
  displayFunctionX // determines what parts of the text of x values should be displayed or not
  
  /**@type {string || int, array[]}*/
  X // the x values that should be displayed
  
  /**@type {object array[]}*/
  Data // will be the lines that will be displayed on the graph

  // Data should be an array of objects and every object can be a line on the graph
  // example object:
  {   
    /**@type {number array[]}*/
    Y // y values of a line

    /**@type {boolean}*/
    showGradient // shows gradient under a line

    /**@type {boolean}*/
    showLastPoint // shows last point a line 

    /**@type {string}*/
    lineColor // line color of a line

    /**@type {number}*/
    lineWidth // line width
    
    /**@type {number array[2]}*/
    lineDash // line dash
      
    /**@type {boolean}*/
    showPoints // shows all the points on a line
  },
})

``` 
this class also provides a few functions that can be used:
`init()`: initializes the graph.
`updateGraph(object: data)`: allows you to update the graph by passing a new object with different values.
`toImageURL(string: imagetype, number: quality)`: turns the graph into a base 64 data image url.


in order get access to the graph data you must add an eventlistener to the document with the type of either the name you've given to the graph or the string "graphData".

example:
```javascript
document.addEventListener("graphData",(e)=>{

  /**@type {object array[]}*/
  e.detail.current // an array of objects for each line that containes the information of the current point or points your mouse or finger is on.
  //current object:
  {
    /**@type {number || string}*/
    x // current x value
     /**@type {number}*/
    y // current y value
     /**@type {string}*/
    line color // current line color
     /**@type {number}*/
    slope // current line slope
  }

  /**@type {object array[]}*/
  e.detail.second // similar to current, but its for a second selected point or points
  // on desktop this value would be created if you hold your mouse down on the graph
  // on mobile it will be created if you have a second finger on the graph 

  /**@type {object{}}*/
  e.detail.currentCoords // x and y coordinates of a point or set of points on the graph in px
  e.detail.secondCoords // x and y coordinates of a point or set of points on the graph in px

  /**@type {number}*/
  e.detail.begin // begin of the graph in px
  e.detail.end // end of the graph in px
  e.detail.top // top of the graph in px
  e.detail.bottom // bottom of the graph in px

})
```