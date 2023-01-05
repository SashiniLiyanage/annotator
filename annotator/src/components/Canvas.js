import React, { useRef, useEffect, useState } from 'react'

const mouse = {x : 0, y : 0, button : 0, lx : 0, ly : 0, update : true};
  
const Canvas = (file) => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const canvaRef = useRef(null)

  const handleMouse = (e)=>{
    var rect = canvaRef.current.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
	  mouse.y = e.clientY - rect.top;
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
    mouse.update = true;
  }

  const point = (x,y) => ({x,y});

  const poly = (ctx) => ({
    points : [],
    activePoint: undefined,
    dragging : false,
    addPoint(p){ this.points.push(point(p.x,p.y)) },
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "rgba(0,0,0,0.2)"

        for (const p of this.points) { ctx.lineTo(p.x,p.y) }
        ctx.closePath();
        
        for (const p of this.points) {
            ctx.moveTo(p.x + 4,p.y);
            ctx.arc(p.x,p.y,3,0,Math.PI *2);
        }
       
        ctx.fill();
        ctx.stroke();
    },
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
    });

    function drawCircle(ctx, pos,size=4){
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(pos.x,pos.y,size,0,Math.PI *2);
      ctx.fill();
      ctx.stroke();
    }

  useEffect(() => {

   
  const canvas = canvaRef.current;
  const ctx = canvas.getContext('2d');

  // window.addEventListener("keydown", keyPress);
  // window.addEventListener("keyup", keyPress);

  const polygon = poly(ctx);
  var cursor;

  const update = ()=>{
      if (mouse.update) {
          cursor = "crosshair";
          ctx.clearRect(0,0,canvas.width,canvas.height);
          if (!polygon.dragging) {  polygon.activePoint = polygon.closest(mouse) }
          if (polygon.activePoint === undefined && mouse.button) {
              polygon.addPoint(mouse);
              mouse.button = false;
              console.log(polygon.points)
          } else if(polygon.activePoint) {
              if (mouse.button) {
                  if(polygon.dragging) {
                      polygon.activePoint.x += mouse.x - mouse.lx;
                      polygon.activePoint.y += mouse.y - mouse.ly;
                  } else {  polygon.dragging = true }
              } else { polygon.dragging = false }
          }
          polygon.draw();
          if (polygon.activePoint) { 
              drawCircle(ctx,polygon.activePoint);
              cursor = "move";
          }
  
          mouse.lx = mouse.x;
          mouse.ly = mouse.y;
          canvas.style.cursor = cursor;
          mouse.update = false;
      }
      requestAnimationFrame(update)
  }

    update();
    
    return () => {
      window.cancelAnimationFrame(update);
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