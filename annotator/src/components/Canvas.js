import React, { useRef, useEffect, useState } from 'react'

const Canvas = (file) => {  
  
  const [size, setSize] = useState({width: 1, height:1})
  const canvaRef = useRef(null)

  useEffect(()=>{
  },[])

  const getDimensions = (img)=>{
    setSize({
      width: img.nativeEvent.srcElement.naturalWidth,
      height: img.nativeEvent.srcElement.naturalHeight,
    })
  }

  const mouseDownHandler = (e)=>{
    var rect = canvaRef.current.getBoundingClientRect();
    console.log("clicked")
    e.stopPropagation()
    console.log("x:",e.clientX - rect.left, " Y:", e.clientY - rect.top)
  }


  return (
    <> 
        <div className="work_area">
          <img className="main_img" onLoad={(e)=>{getDimensions(e)}} src={file["file"]} alt="no image"/> 
          <canvas className='main_canvas' onMouseDown={(e)=>{mouseDownHandler(e)}} ref={canvaRef} width={size.width} height={size.height}>Sorry, Canvas functionality is not supported.</canvas>
        </div>
    </>
  )
}

export default Canvas;