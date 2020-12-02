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
		for (let j = 0; j < width; j++) {

			
			var index = getIndex(j, i, width)
		
			const redIndex =  index + R_OFFSET
			const greenIndex = index + G_OFFSET
			const blueIndex = index + B_OFFSET
			
			const redValue = computeMatrix[redIndex]
			const greenValue = computeMatrix[greenIndex]
			const blueValue = computeMatrix[blueIndex]

			const mean = (redValue + greenValue + blueValue) / 3

			computeMatrix[redIndex] = clamp(mean)
			computeMatrix[greenIndex] = clamp(mean)
			computeMatrix[blueIndex] = clamp(mean)

		}
	}


	postMessage({computeMatrix, height, i});
}


