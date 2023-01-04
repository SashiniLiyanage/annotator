import React, { useRef, useEffect, useState } from 'react'
import Image from '../assets/swan.jpg'

const Canvas = props => {
  
    const [imageWidth, setImageWidth] = useState(0);
    const canvasRef = useRef(null)
    const imageRef = useRef(null)
    
    const draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        ctx.fill()
    }
    
    useEffect(() => {
        console.log(imageWidth)
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId
        
        const render = () => {
        frameCount++
        draw(context, frameCount)
        animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
        window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw, imageWidth])
    
  return (
    <>
        <div className='work_area'>
        <img className="main_img" src={Image} ref={imageRef} onLoad={(e)=>{setImageWidth(e)}} alt="no image"/> 
        <canvas className='main_canvas' ref={canvasRef} {...props}>Sorry, Canvas functionality is not supported.</canvas>
        </div>
    </>
  )
}

export default Canvas;