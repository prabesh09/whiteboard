import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Line, Rect } from 'react-konva'
import { saveAs } from 'file-saver'
import Menu from './Menu'
import useLocalStorage from '../hooks/useLocalStorage'

const Canvas = () => {
    const [tool, setTool] = useLocalStorage('tool', null)
    const [color, setColor] = useLocalStorage('color', '#000000')
    const [bgColor, setBgColor] = useLocalStorage('bgColor', '#ffffff')
    const [lines, setLines] = useState([])
    const stageRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const storedLines = JSON.parse(localStorage.getItem('lines'))
        if (storedLines) {
            setLines(storedLines)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('lines', JSON.stringify(lines))
    }, [lines])

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDrawing) return
            const stage = stageRef.current.getStage()
            const point = stage.getPointerPosition()
            let lastLine = lines[lines.length - 1]
            lastLine.points = lastLine.points.concat([point.x, point.y])
            setLines([...lines])
        }

        const handleTouchMove = (e) => {
            if (!isDrawing) return
            const stage = stageRef.current.getStage()
            const touchPos = e.touches[0]
            const touchX = touchPos.clientX - stage.container().getBoundingClientRect().left
            const touchY = touchPos.clientY - stage.container().getBoundingClientRect().top
            let lastLine = lines[lines.length - 1]
            lastLine.points = lastLine.points.concat([touchX, touchY])
            setLines([...lines])
        }

        if (isDrawing) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('touchmove', handleTouchMove)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [isDrawing, lines, setLines])

    const handleMouseDown = (e) => {
        setIsDrawing(true)
        const pos = e.target.getStage().getPointerPosition()
        setLines([...lines, { tool, color, points: [pos.x, pos.y] }])
    }

    const handleMouseUp = () => {
        setIsDrawing(false)
    }

    const handleDownload = () => {
        const dataURL = stageRef.current.toDataURL()
        saveAs(dataURL, 'canvas.png')
    }

    const handleClear = () => {
        setLines([])
    }

    return (
        <div className='overflow-hidden'>
            <Menu
                tool={tool}
                setTool={setTool}
                color={color}
                setColor={setColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                handleDownload={handleDownload}
                handleClear={handleClear}
            />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    <Rect
                        width={window.innerWidth}
                        height={window.innerHeight}
                        fill={bgColor}
                    />
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.tool === 'eraser' ? bgColor : line.color}
                            strokeWidth={line.tool === 'eraser' ? 5 : 3}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default Canvas