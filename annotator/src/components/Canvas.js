import React, { useRef, useEffect, useState } from 'react';
import {Button, Stack,Drawer, IconButton} from '@mui/material';
import mouth from '../assets/mouth.jpg';
import icon from '../assets/note.png';
import colorPallete from './colors'
import {Preview,ZoomIn,CropFree,ZoomOut,Close, CancelOutlined} from '@mui/icons-material';

const regionNames = ["teeth","Enemal","Hard Plate","Mole","Soft Plate","Tongue","Stain","Uvula","Gingiva","Lips"]
const colors = colorPallete
const mouse = {x : 0, y : 0, button : 0, cursor: 'crosshair'};
var regions = []
var isDragging = false;
var isSelected = false;
var isDrawing = true ;
var isMoving = false;
var polygon
var canvas
var ctx
var colCanvas 
var colctx
var selectedRegion
var defaultType = "Unknown"
var defaultColor = 'rgb(0,0,0)'

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
    this.color = defaultColor;
    this.transcolor =  defaultColor.replace(')', ', 0.6)').replace('rgb', 'rgba')
    this.type = defaultType
    //this.randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    //this.color = 'rgb(' + this.randomColors[0] + ', ' + this.randomColors[1] +',' + this.randomColors[2] + ')';
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
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.transcolor
      for (const p of this.points) { this.ctx.lineTo(p.x,p.y) }
      this.ctx.closePath();
      // for (const p of this.points) {
      //   this.ctx.moveTo(p.x + 4,p.y);
      //   this.ctx.arc(p.x,p.y,3,0,Math.PI *2);
      // }
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
        this.ctx.strokeStyle = this.color;
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

      // indicate selection
      if(this.isSelected){
        for (const p of this.points) { drawCircle(this.ctx, p) }
        var inside = this.isPointInPoly(mouse)
        if(inside || this.activePoint ) mouse.cursor = "move"
      }

      this.mouse.lx = mouse.x;
      this.mouse.ly = mouse.y;
  }
}

const Canvas = () => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const [orginalSize, setOriginalSize] = useState({width: 1, height:1})
  const [showPoints, setShowPoints] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [state, setState] = React.useState(false);

  const canvaRef = useRef(null)
  const colCanvasRef = useRef(null)

  const show_regions = () =>{
    if(isDrawing) return;

    var coordinates = [];
    var type = [];
    [...regions].forEach(region =>{
      if(region.completed){
        var pointArray = []
        for (const p of region.points) {
          pointArray.push(Math.round(p.x /zoomLevel),Math.round(p.y /zoomLevel))
        }
        coordinates.push(pointArray.toString())
        type.push(region.type)
      }
    })

    setShowPoints(
      coordinates.map((points, index) =>
        <tr  key={index}>
          <td>{type[index]}</td>
          <td>{points}</td>
        </tr>
      )
    )

    if(coordinates.length === 0) return
    setState(true)
  }

  const delete_selected = () =>{
    if(selectedRegion){
      selectedRegion.markedForDeletion = true;
      isSelected = false;
    }
  }

  const handle_keypress = (e) =>{
    if(e.key === "Enter") {
      
      [...regions].forEach(region => {
        if(region.points.length < 3) region.markedForDeletion = true;
        region.completed = true
        region.isSelected = false
      });
  
      polygon = new Polygon(ctx, colctx)
      regions.push(polygon)
    }
  
    if(e.key === "Delete") {
      delete_selected()
    }

  }

  const deselect_all = (e) =>{
    if (e.target.className !== 'page_body')  return;

    if(selectedRegion){
      selectedRegion.isSelected = false;
      isSelected = false;
    }

    selectedRegion = null;
  }

  const handleSelect = () =>{

    isSelected = false;
    selectedRegion = null;

  
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
        selectedRegion = regions[i]
        return
      // if a region is already selected that means
      // user needs to select another region or create a new region
      }else if(regions[i].isSelected){
        if(regions[i].isPointInPoly(mouse)) selectedIndex = i;
        regions[i].isSelected = false;
        selectedRegion = null;
        break
      }
    }

    // select the next unselected region
    for(i=selectedIndex+1;i<regions.length;i++){
      if((regions[i].isPointInPoly(mouse)) && regions[i].completed){
        regions[i].isSelected = true;
        isSelected = true;
        selectedRegion = regions[i]
        break
      }
    }
  }

  const handle_mouse = (e)=>{
  
    var rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if(e.type === "dblclick"){
      if(isSelected){
        [...regions].forEach(region =>{
          if(region.isSelected && region.isPointInPoly(mouse)){
            isMoving = true
          }
        })
    
      }
    }

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

  window.addEventListener("keydown", handle_keypress);
  window.addEventListener("keyup", handle_keypress);

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
 
  // zoom in
  const zoom_in = ()=>{
    if(isDrawing || zoomLevel > 4) return

    setSize({
      width: orginalSize.width * zoomLevel *1.5,
      height: orginalSize.height * zoomLevel *1.5
    });
    
    [...regions].forEach(region =>{
      var pointArray = []
      for (const p of region.points) {
        pointArray.push(point(p.x * 1.5 , p.y * 1.5))
      }
      region.points = pointArray
    })
   

    setZoomLevel(zoomLevel*1.5)
  }

  // zoom out
  const zoom_out = ()=>{
    if(isDrawing || zoomLevel < 0.25) return
    setSize({
      width: orginalSize.width * zoomLevel /1.5 ,
      height: orginalSize.height * zoomLevel /1.5
    });
    
    [...regions].forEach(region =>{
      var pointArray = []
      for (const p of region.points) {
        pointArray.push(point(p.x / 1.5 , p.y / 1.5))
      }
      region.points = pointArray
    })

    setZoomLevel(zoomLevel/1.5)
  }

  // zoom reset
  const zoom_reset = ()=>{
    if(isDrawing || zoomLevel === 1) return

    setSize({
      width: orginalSize.width ,
      height: orginalSize.height
    });
    
    [...regions].forEach(region =>{
      var pointArray = []
      for (const p of region.points) {
        pointArray.push(point(p.x / zoomLevel , p.y / zoomLevel))
      }
      region.points = pointArray
    })

    setZoomLevel(1)
  }
  
  //set types
  const set_types = (colorId, name)=>{
    defaultColor = colors[colorId].main;
    defaultType = name;

    [...regions].forEach(region => {
      if(!region.completed){
        region.color = defaultColor
        region.transcolor = defaultColor.replace(')', ', 0.6)').replace('rgb', 'rgba')
        region.type = name
      }
    });

    if(selectedRegion){
      selectedRegion.color = defaultColor
      selectedRegion.transcolor = defaultColor.replace(')', ', 0.6)').replace('rgb', 'rgba')
      selectedRegion.type = name
    }
  }

  // get the size of the image
  const get_dimensions = (img)=>{
    setOriginalSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
    setSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
  }

  // clear all regions
  const clear_all = ()=>{
    [...regions].forEach(region => region.markedForDeletion = true);
    polygon = new Polygon(ctx, colctx)
    regions.push(polygon)
  }

  return (
    <div className='body'>
    <div className='nav_bar'>
    <div className='icon'>
      <img src={icon} alt='icon'></img>
    </div>
    <IconButton onClick={show_regions} sx={{color: 'white', ml: 1}} title="Show Regions"><Preview/></IconButton>
    <IconButton onClick={zoom_in} sx={{color: 'white', ml: 1}}  title="Zoom In"><ZoomIn/></IconButton>
    <IconButton onClick={zoom_out} sx={{color: 'white', ml: 1}}  title="Zoom Out"><ZoomOut/></IconButton>
    <IconButton onClick={zoom_reset} sx={{color: 'white', ml: 1}}  title="Zoom Reset"><CropFree/></IconButton>
    <IconButton onClick={delete_selected} sx={{color: 'white', ml: 1}}  title="Clear Selected"><Close/></IconButton>
    <IconButton onClick={clear_all} sx={{color: 'white', ml: 1}} title="Clear All"><CancelOutlined/></IconButton>
    </div>
    <div className='page_body' onMouseDown={(e)=>{deselect_all(e)}}>
        <div className='side_bar'>
        <Stack direction="column" spacing={1} sx={{padding: "10px 5px"}}>
        {regionNames.map((name, index) =>{
            var colorId = 'r'+index.toString()
            return (<Button key={index} variant='contained' color={colorId} onClick={()=>set_types(colorId, name)} value={name} size='small' fullWidth>{name}</Button>)
        })}
        </Stack>
        </div>
        <div className="work_area">
          <canvas className='collision_canvas' ref={colCanvasRef} width={size.width} height={size.height}/>
          <canvas className='main_canvas' onDoubleClick={(e)=>handle_mouse(e)} onMouseMove={(e)=>{handle_mouse(e)}} onMouseDown={(e)=>{handle_mouse(e)}} onMouseUp={(e)=>{handle_mouse(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
          <img className="main_img" onLoad={(e)=>{get_dimensions(e)}}  width={size.width} height={size.height} src={mouth} alt="failed to load"/> 
        </div>
          <Drawer
            anchor='bottom'
            open={state}
            onClose={()=>{setState(false)}}
          >
            <div style={{display: "flex", justifyContent: "flex-end"}}><IconButton aria-label="delete" onClick={()=>setState(false)} color="primary"><Close/></IconButton></div>
            <table className='show_regions'>
              <tbody>
                <tr>
                  <th>Region</th>
                  <th>Coordinates</th>
                </tr>
                {showPoints}
              </tbody>
            </table>
          </Drawer> 
    </div>
    </div>
  )
}

export default Canvas;