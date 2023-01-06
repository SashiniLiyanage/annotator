import React, { useRef, useEffect, useState } from 'react'
import {Button} from '@mui/material';
import mouth from '../assets/mouth.jpg'

const mouse = {x : 0, y : 0, button : 0, cursor: 'crosshair'};
var regions = []
var isDragging = false;
var isSelected = false;
var isDrawing = true ;
var polygon
var canvas
var ctx
var  colCanvas 
var colctx
const point = (x,y) => ({x,y});

function drawCircle(ctx, pos,size=4){
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(pos.x,pos.y,size,0,Math.PI *2);
  ctx.fill();
  ctx.stroke();
}

class Polygon{
  constructor(ctx, colctx){
    this.ctx = ctx;
    this.isSelected = false;
    this.colctx = colctx;
    this.points = [];
    this.mouse = {lx: 0, ly: 0}
    this.activePoint = undefined;
    this.dragging = false;
    this.completed = false;
    this.markedForDeletion = false;
    this.randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    this.color = 'rgb(' + this.randomColors[0] + ', ' + this.randomColors[1] +',' + this.randomColors[2] + ')';
  }
  addPoint(p){ 
    this.points.push(point(p.x,p.y)) 
  }
  isPointInPoly(pt){
    for(var c = false, i = -1, l = this.points.length, j = l - 1; ++i < l; j = i)
        ((this.points[i].y <= pt.y && pt.y < this.points[j].y) || (this.points[j].y <= pt.y && pt.y <this.points[i].y))
        && (pt.x < (this.points[j].x - this.points[i].x) * (pt.y - this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x)
        && (c = !c);
    return c;
  }
  draw() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "yellow";
      this.ctx.fillStyle = "rgba(0,0,0,0.2)"
      for (const p of this.points) { this.ctx.lineTo(p.x,p.y) }
      this.ctx.closePath();
      for (const p of this.points) {
        this.ctx.moveTo(p.x + 4,p.y);
        this.ctx.arc(p.x,p.y,3,0,Math.PI *2);
      }
      this.ctx.fill();
      this.ctx.stroke();
      
      // collision panel
      this.colctx.beginPath();
      this.colctx.lineWidth = 0;
      this.colctx.fillStyle = this.color
      for (const p of this.points) { this.colctx.lineTo(p.x,p.y) }
      this.colctx.closePath();
      this.colctx.fill();
      this.colctx.stroke();

  }
  closest(pos, dist = 8) {
    var i = 0, index = -1;
    dist *= dist;
    for (const p of this.points) {
        var x = pos.x - p.x;
        var y = pos.y - p.y;
        var d2 =  x * x + y * y;
        if (d2 < dist) {
            dist = d2;
            index = i;
        }
        i++;
    }
    if (index > -1) { return this.points[index] }
  }
  update(){
      // line following the cursor
      if(!this.completed && this.points.length !== 0){
        isDrawing = true
        this.ctx.strokeStyle = "yellow";
        this.ctx.beginPath();
        this.ctx.moveTo(mouse.x,mouse.y)
        this.ctx.lineTo(this.points[this.points.length-1].x,this.points[this.points.length-1].y)
        this.ctx.stroke();
      }else{
        isDrawing = false;
      }

      // if not dragging get the closest point to mouse
      if (!this.dragging) {  this.activePoint = this.closest(mouse) }

      // if not dragging and mouse button clicked and when other regions are not selected add a point
      if (this.activePoint === undefined && !isDragging && !isSelected && mouse.button && !this.completed) {
          this.addPoint(mouse);
          mouse.button = false;
      // if completed and dragging update the points
      } else if(this.activePoint && this.completed && this.isSelected ) {
          if (mouse.button) {
              isDragging = true;
              if(this.dragging) {
                this.activePoint.x += mouse.x - this.mouse.lx;
                this.activePoint.y += mouse.y - this.mouse.ly;
              } else {this.dragging = true}
          } else {
            this.dragging = false
            isDragging = false;
          }
      }
      this.draw();

      // draw circle on active point
      if (this.activePoint && this.completed && this.isSelected) { 
          mouse.cursor = "move";
      }

      if(this.isSelected){
        for (const p of this.points) { drawCircle(this.ctx, p) }
      }

      this.mouse.lx = mouse.x;
      this.mouse.ly = mouse.y;
  }
}

const Canvas = () => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const [showPoints, setShowPoints] = useState(false)
  const canvaRef = useRef(null)
  const colCanvasRef = useRef(null)

  const showRegions = () =>{
    var coordinates = [];
    [...regions].forEach(region =>{
      var pointArray = []
      for (const p of region.points) {
        pointArray.push(p.x,p.y)
      }
      coordinates.push(pointArray)
    })
   
    setShowPoints(
      coordinates.map((points, index) =>
        <li key={index}>[{points.toString()}]</li>
      )
    )
  }

  const keyPress = (e) =>{
    if(e.key === "Enter") {
  
      showRegions();

      [...regions].forEach(region => {
        if(region.points.length < 3) region.markedForDeletion = true;
        region.completed = true
        region.isSelected = false
      });
  
      polygon = new Polygon(ctx, colctx)
      regions.push(polygon)
    }
  
    if(e.key === "Delete") {
      [...regions].forEach(region => {
        if(region.isSelected) region.markedForDeletion = true
      })
  
      polygon = new Polygon(ctx, colctx)
      regions.push(polygon)
    }
  }

  const handleSelect = () =>{
    isSelected = false;
    
    //if drawing don't select
    if(isDrawing) return

    var selectedIndex = -1;
    var i;
    for(i=0; i< regions.length; i++){
      // if closest to a point select that region
      if((regions[i].closest(mouse)) && regions[i].completed){
        // set all are unselected
        [...regions].forEach(region => region.isSelected = false)
        // select only the closest region
        isSelected = true;
        regions[i].isSelected = true;
        return
      // if a region is already selected that means
      // user needs to select another region or create a new region
      }else if(regions[i].isSelected){
        if(regions[i].isPointInPoly(mouse)) selectedIndex = i;
        regions[i].isSelected = false;
        break
      }
    }

    // select the next unselected region
    for(i=selectedIndex+1;i<regions.length;i++){
      if((regions[i].isPointInPoly(mouse)) && regions[i].completed){
        regions[i].isSelected = true;
        isSelected = true;
        break
      }
    }

}

const handleMouse = (e)=>{
 
  var rect = canvas.getBoundingClientRect();

  mouse.x = Math.round(e.clientX - rect.left);
  mouse.y = Math.round(e.clientY - rect.top);

  if(e.type === "mousedown"){
      handleSelect()     
  }

  mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
}


  useEffect(() => {
   
  canvas = canvaRef.current;
  ctx = canvas.getContext('2d');
  
  colCanvas = colCanvasRef.current;
  colctx = colCanvas.getContext('2d')

  polygon = new Polygon(ctx, colctx)
  regions.push(polygon)

  window.addEventListener("keydown", keyPress);
  window.addEventListener("keyup", keyPress);

  const annotate = ()=>{
      ctx.clearRect(0,0, canvas.width, canvas.height);
      colctx.clearRect(0,0, canvas.width, canvas.height);
      mouse.cursor = "crosshair";
      [...regions].forEach(region => {region.update()})
      
      regions = regions.filter(region => !region.markedForDeletion);

      canvas.style.cursor = mouse.cursor;

      requestAnimationFrame(annotate)
  }

  annotate();
    
    return () => {
      window.cancelAnimationFrame(annotate);
    };
  }, []);
 


  // get the size of the image
  const getDimensions = (img)=>{
    setSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
  }

  // clear all regions
  const clearAll = ()=>{
    [...regions].forEach(region => region.markedForDeletion = true);
    polygon = new Polygon(ctx, colctx)
    regions.push(polygon)
  }

  return (
    <>
    <div className='nav_bar'>
    <div className='nav_button' onClick={clearAll} title="clear all">Clear All</div>
    <div className='nav_button' onClick={showRegions} title="Show Regions">Show Regions</div>
    </div>
    <div className='page_body'>
        <div className="work_area">
          <canvas className='collision_canvas' ref={colCanvasRef} width={size.width} height={size.height}/>
          <canvas className='main_canvas' onDoubleClick={(e)=>handleMouse(e)} onMouseMove={(e)=>{handleMouse(e)}} onMouseDown={(e)=>{handleMouse(e)}} onMouseUp={(e)=>{handleMouse(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
          <img className="main_img" onLoad={(e)=>{getDimensions(e)}} src={mouth} alt="failed to load"/> 
        </div>
    </div>
    <ul>{showPoints}</ul>
    </>
  )
}

export default Canvas;