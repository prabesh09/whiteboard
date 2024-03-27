import React, { useState } from 'react'
import { FiEdit2, FiDownload, FiDroplet } from 'react-icons/fi'
import { RxEraser, RxMagicWand } from "react-icons/rx"
import { ChromePicker } from 'react-color'

const Menu = ({ tool, setTool, color, setColor, bgColor, setBgColor, handleDownload, handleClear }) => {
    const [showPencilColor, setShowPencilColor] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)

    return (
        <div className="flex bg-[#f0f0f0] justify-center gap-5 items-center p-4 text-xl">

            <div>
                <button onClick={() => {
                    setTool('pen')
                    setShowPencilColor(!showPencilColor)
                    setShowColorPicker(false)
                }}><FiEdit2 /></button>
                {showPencilColor && (
                    <div style={{ position: 'absolute', zIndex: 1 }}>
                        <ChromePicker
                            color={color}
                            onChange={(color) => setColor(color.hex)}
                        />
                    </div>
                )}
            </div>

            <button onClick={() => setTool('eraser')}>
                <RxEraser />
            </button>

            <div style={{ position: 'relative' }}>
                <button onClick={() => {
                    setShowColorPicker(!showColorPicker)
                    setShowPencilColor(false)
                }}><FiDroplet /></button>
                {showColorPicker && (
                    <div style={{ position: 'absolute', zIndex: 1 }}>
                        <ChromePicker
                            color={bgColor}
                            onChange={(color) => setBgColor(color.hex)}
                        />
                    </div>
                )}
            </div>

            <button onClick={handleDownload}><FiDownload /></button>
            <button onClick={handleClear}><RxMagicWand /></button>
        </div>
    )
}

export default Menu