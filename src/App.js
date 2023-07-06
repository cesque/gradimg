import { useEffect, useState } from 'react'
import styles from './App.module.css'
import Canvas from './components/Canvas/Canvas'
import boxify from './boxify'

function App() {
    let [image, setImage] = useState()
    let [baseData, setBaseData] = useState()
    let [boxes, setBoxes] = useState([])
    let [boxSize, setBoxSize] = useState(16)

    function loadImage(name, filetype) {
        let image = new Image()

        image.onload = () => {
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height

            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            let data = ctx.getImageData(0, 0, canvas.width, canvas.height)

            setImage(image)
            setBaseData(data)
        }

        image.src = `/images/${ name }.${ filetype || 'jpeg' }`        
    }

    useEffect(() => {
        if(baseData) {
            setBoxes(boxify(baseData, boxSize))
        }
    }, [baseData, boxSize])

    useEffect(() => {
        loadImage('header', 'png')
    }, [])

    function getCanvas() {
        if(!baseData) return null

        return <Canvas width={ baseData.width }
            height={ baseData.height }
            boxSize={ boxSize }
            boxes={ boxes }
            image={ image }
        />
    }

    return <div className={ styles.app }>
        { getCanvas() }
    </div>
}

export default App
