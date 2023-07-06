import styles from './Canvas.module.css'

import { useEffect, useRef, useState } from 'react'

function makeColorString(color) {
    let { r, g, b } = color
    let a = [r, g, b]
    return `rgba(${ a.join(', ') }, 1)`
}

export default function Canvas({ width, height, image, boxSize, boxes }) {
    let [scale, setScale] = useState(0.4)
    let canvasRef = useRef()

    useEffect(() => {
        redraw()
    }, [boxes, boxSize])

    function redraw() {
        let ctx = canvasRef.current.getContext('2d')
        ctx.imageSmoothingEnabled = false
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width * scale, height * scale)

        let renderer = document.createElement('canvas')
        renderer.width = width
        renderer.height = height
        let rendererCtx = renderer.getContext('2d')
        rendererCtx.fillStyle = 'darkblue'
        rendererCtx.fillRect(0, 0, width, height)

        // rendererCtx.drawImage(image, 0, 0)

        for (let box of boxes) {
            let x = box.x * boxSize
            let y = box.y * boxSize
            console.log(box)

            if (box.centers.light == null) {
                rendererCtx.fillStyle = makeColorString(box.dark)
            } else if (box.centers.dark == null) {
                rendererCtx.fillStyle = makeColorString(box.light)
            } else {
                let gradient = rendererCtx.createLinearGradient(
                    x + box.centers.light.x * boxSize,
                    y + box.centers.light.y * boxSize,
                    x + box.centers.dark.x * boxSize,
                    y + box.centers.dark.y * boxSize
                )
    
                gradient.addColorStop(0, makeColorString(box.light))
                gradient.addColorStop(1, makeColorString(box.dark))
    
                rendererCtx.fillStyle = gradient
            }
            
            rendererCtx.fillRect(x, y, boxSize, boxSize)

            // box.yIntercept = 0

            // rendererCtx.fillStyle = makeColorString(box.light)
            // rendererCtx.beginPath()
            // rendererCtx.arc(
            //     x + box.centers.light.x * boxSize,
            //     y + box.centers.light.y * boxSize,
            //     2,
            //     0,
            //     Math.PI * 2
            // )
            // rendererCtx.fill()

            // rendererCtx.fillStyle = makeColorString(box.dark)
            // rendererCtx.beginPath()
            // rendererCtx.arc(
            //     x + box.centers.dark.x * boxSize,
            //     y + box.centers.dark.y * boxSize,
            //     2,
            //     0,
            //     Math.PI * 2
            // )
            // rendererCtx.fill()
        }

        ctx.drawImage(renderer, 0, 0, width * scale, height * scale)
    }

    return <canvas width={ width * scale } height={ height * scale } ref={ canvasRef } />
}