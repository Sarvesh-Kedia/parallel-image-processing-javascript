// The image is stored as a 1d array with red first, then green, and blue 
const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2
const A_OFFSET = 3


// Given the x, y index, return what position it should be in a 1d array
function getIndex(x, y, width) {
	return (x + y * width) * 4
}

// Ensure value remain in RGB, 0 - 255
function clamp(value) {
	return Math.max(0, Math.min(Math.floor(value), 255))
}

// Sum up elements in a multidimensional array
const arrSum = kernel => kernel.reduce(
	(sum, num) => sum + (Array.isArray(num) ? arrSum(num) : num * 1),
	0
);



onmessage = function(e) {
	// console.log("Message received from main script.");

	// single row and column multiplication

	var computeMatrix = e.data.computeMatrix
    var height = e.data.height
    var width = e.data.width
    var i = e.data.i

    
    // For every pixel of the src image
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width/2; j++) {

            var index = getIndex(j, i, width)
            var index2 = getIndex(width-j, i, width)

            const redIndex =  index + R_OFFSET
            const greenIndex = index + G_OFFSET
            const blueIndex = index + B_OFFSET

            const redIndex2 =  index2 + R_OFFSET
            const greenIndex2 = index2 + G_OFFSET
            const blueIndex2 = index2 + B_OFFSET


            // swap the pixels in indiex1 and index2 for each colour

            var tempr = computeMatrix[redIndex]
            var tempg = computeMatrix[greenIndex]
            var tempb = computeMatrix[blueIndex]

            computeMatrix[redIndex] = computeMatrix[redIndex2]
            computeMatrix[greenIndex] = computeMatrix[greenIndex2]
            computeMatrix[blueIndex] = computeMatrix[blueIndex2]

            computeMatrix[redIndex2] = tempr
            computeMatrix[greenIndex2] = tempg
            computeMatrix[blueIndex2] = tempb

        }
    }
	postMessage({computeMatrix, height, i});
}


