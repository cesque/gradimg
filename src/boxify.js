function getLuminance(color) {
    let { r, g, b } = color
    return Math.sqrt((0.241 * r * r) + (0.691 * g * g) + (0.068 * b * b)) / 255
}

export default function boxify(image, boxSize) {
    let width = image.width - (image.width % boxSize)
    let height = image.height - (image.height % boxSize)
    let data = image.data

    function getBoxData(boxX, boxY) {
        let array = []
        // make list of pixels with color
        for(let y = boxY; y < boxY + boxSize; y++) {
            for(let x = boxX; x < boxX + boxSize; x++) {
                let index = ((y * image.width) + (x % image.width)) * 4
                let [r, g, b, a] = image.data.slice(index, index + 4)


                array.push({
                    x: x - boxX,
                    y: y - boxY,
                    color: { r, g, b },
                })
            }
        }

        let totalLuminance = array.reduce((p, c) => p + getLuminance(c.color), 0)
        let averageLuminance = totalLuminance / array.length

        let totals = {
            dark: { r: 0, g: 0, b: 0, n: 0 },
            light: { r: 0, g: 0, b: 0, n: 0 },
        }

        for(let pixel of array) {
            let luminance = getLuminance(pixel.color)

            let type = luminance > averageLuminance ? 'light' : 'dark'
            totals[type].r += pixel.color.r
            totals[type].g += pixel.color.g
            totals[type].b += pixel.color.b
            totals[type].n++

            pixel.type = type
        }

        let light = {}
        light.r = Math.floor(totals.light.r / totals.light.n)
        light.g = Math.floor(totals.light.g / totals.light.n)
        light.b = Math.floor(totals.light.b / totals.light.n)
        let dark = {}
        dark.r = Math.floor(totals.dark.r / totals.dark.n)
        dark.g = Math.floor(totals.dark.g / totals.dark.n)
        dark.b = Math.floor(totals.dark.b / totals.dark.n)

        if (totals.light.n == 0) light = dark
        if (totals.dark.n == 0) dark = light

        return {
            light,
            dark,
            centers: getCenters(array),
        }
    }

    function getCenters(pixels) {
        let light = pixels.filter(pixel => pixel.type == 'light')
        let dark = pixels.filter(pixel => pixel.type == 'dark')

        function average(list) {
            if(list.length == 0) return null
            
            let totalPosition = list.reduce((p, c) => {
                let normX = c.x / boxSize
                let normY = c.y / boxSize

                return { 
                    x: p.x + normX,
                    y: p.y + normY,
                }
            }, { x: 0, y: 0 })

            return {
                x: totalPosition.x / list.length,
                y: totalPosition.y / list.length,
            }
        }
        
        return {
            light: average(light),
            dark: average(dark),
        }
    }

    // function getBestFitLine(pixels) {
    //     let lightPixels = pixels.filter(pixel => pixel.type == 'light')
    //     // Count = the number of points
    //     let count = lightPixels.length
    //     // SumX = sum of all the X values
    //     let sumX = 0
    //     // SumY = sum of all the Y values
    //     let sumY = 0
    //     // SumX2 = sum of the squares of the X values
    //     let sumX2 = 0
    //     // SumXY = sum of the products X*Y for all the points
    //     let sumXY = 0

    //     for(let pixel of lightPixels) {
    //         // normX, normY go from -1 to 1
    //         let normX = ((pixel.x / boxSize) - 0.5) * 2
    //         let normY = ((pixel.y / boxSize) - 0.5) * 2
    //         sumX += normX
    //         sumY += normY
    //         sumX2 += (normX ** 2)
    //         sumXY += (normX * normY)
    //     }

    //     // Now we can find the slope M and Y-intercept YInt of the line we want:

    //     // XMean = SumX / Count
    //     let xMean = sumX / count
    //     // YMean = SumY / Count
    //     let yMean = sumY / count
    //     // Slope = (SumXY - SumX * YMean) / (SumX2 - SumX * XMean)
    //     let slope = (sumXY - sumX * yMean) / (sumX2 - sumX * xMean)
    //     // YInt = YMean - Slope * XMean
    //     let yIntercept = yMean - slope + xMean

    //     return {
    //         slope,
    //         yIntercept,
    //         angle: Math.atan(slope) * Math.PI * 2,
    //     }
    // }

    let boxes = []

    for (let boxX = 0; boxX < width; boxX += boxSize) {
        for (let boxY = 0; boxY < height; boxY += boxSize) {
            let rgb = [0,0,0].map(() => Math.floor(Math.random() * 255))
            boxes.push({
                x: boxX / boxSize,
                y: boxY / boxSize,
                ...getBoxData(boxX, boxY),
            })
        }
    }

    return boxes
}