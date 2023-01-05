import React, { useRef, useEffect, useState } from 'react'

const mouse = {x : 0, y : 0, button : 0, lx : 0, ly : 0, update : true};
var cursor = "crosshair"

const Canvas = (file) => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const canvaRef = useRef(null)
  const regions = []

  class Polygon{
    constructor(canva, ctx){
      this.ctx = ctx;
      this.canva = canva
      this.points = [];
      this.activePoint = undefined;
      this.dragging = false;
      this.completed = false;
    }
    addPoint(p){ 
      this.points.push(point(p.x,p.y)) 
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
      if (mouse.update) {
        cursor = "crosshair";
        this.ctx.clearRect(0,0,this.canva.width,this.canva.height);
        if(!this.completed && this.points.length !== 0){
          this.ctx.strokeStyle = "yellow";
          this.ctx.beginPath();
          this.ctx.moveTo(mouse.x,mouse.y)
          this.ctx.lineTo(this.points[this.points.length-1].x,this.points[this.points.length-1].y)
          this.ctx.stroke();
        }
        if (!this.dragging) {  this.activePoint = this.closest(mouse) }
        if (this.activePoint === undefined && mouse.button && !this.completed) {
            this.addPoint(mouse);
            mouse.button = false;
            console.log(this.points)
        } else if(this.activePoint && this.completed ) {
            if (mouse.button) {
                if(this.dragging) {
                  this.activePoint.x += mouse.x - mouse.lx;
                  this.activePoint.y += mouse.y - mouse.ly;
                } else {  this.dragging = true }
            } else { this.dragging = false }
        }
        this.draw();
        if (this.activePoint && this.completed) { 
            drawCircle(this.ctx,this.activePoint);
            cursor = "move";
        }

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.update = false;
      }
    }
    finish(){
      this.completed = true;
    }
  }

  const handleMouse = (e)=>{
    var rect = canvaRef.current.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
	  mouse.y = e.clientY - rect.top;
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
    mouse.update = true;
  }

  const point = (x,y) => ({x,y});
  
  function drawCircle(ctx, pos,size=4){
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,size,0,Math.PI *2);
    ctx.fill();
    ctx.stroke();
  }

  function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
  }

  useEffect(() => {

   
  const canvas = canvaRef.current;
  const ctx = canvas.getContext('2d');

  const polygon = new Polygon(canvas,ctx)
  regions.push(polygon)

  const keyPress = () =>{
    polygon.finish()
  }


  window.addEventListener("keydown", keyPress);
  window.addEventListener("keyup", keyPress);

  const annotate = ()=>{
      canvas.style.cursor = cursor;
      polygon.update()
      
      requestAnimationFrame(annotate)
  }

  annotate();
    
    return () => {
      window.cancelAnimationFrame(annotate);
    };
  }, []);

  const getDimensions = (img)=>{
    setSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
  }


  return (
    <> 
        <div className="work_area">
          <canvas className='main_canvas' onMouseMove={(e)=>{handleMouse(e)}} onMouseDown={(e)=>{handleMouse(e)}} onMouseUp={(e)=>{handleMouse(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
          <img className="main_img" onLoad={(e)=>{getDimensions(e)}} src={file["file"]} alt="failed to load"/> 
        </div>
    </>
  )
}

export default Canvas;