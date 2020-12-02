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

	var computeMatrix = e.data.computeMatrix
    var height = e.data.height
    var width = e.data.width
    var i = e.data.i
    var ksum = e.data.ksum
    var kernel = e.data.kernel
    
	// For every pixel of the src image
	for (let i = 1; i < height-1; i++) {
		for (let j = 1; j < width-1; j++) {
			
			
			var index = getIndex(j, i, width)


			var index0 = getIndex(j-1, i-1, width)
			var index1 = getIndex(j, i-1, width)
			var index2 = getIndex(j+1, i-1, width)
			var index3 = getIndex(j-1, i, width)
			var index4 = getIndex(j, i, width)
			var index5 = getIndex(j+1, i, width)
			var index6 = getIndex(j-1, i+1, width)
			var index7 = getIndex(j, i+1, width)
			var index8 = getIndex(j+1, i+1, width)


			const redIndex0 =  index0 + R_OFFSET
			const redIndex1 =  index1 + R_OFFSET
			const redIndex2 =  index2 + R_OFFSET
			const redIndex3 =  index3 + R_OFFSET
			const redIndex4 =  index4 + R_OFFSET
			const redIndex5 =  index5 + R_OFFSET
			const redIndex6 =  index6 + R_OFFSET
			const redIndex7 =  index7 + R_OFFSET
			const redIndex8 =  index8 + R_OFFSET

			const greenIndex0 =  index0 + G_OFFSET
			const greenIndex1 =  index1 + G_OFFSET
			const greenIndex2 =  index2 + G_OFFSET
			const greenIndex3 =  index3 + G_OFFSET
			const greenIndex4 =  index4 + G_OFFSET
			const greenIndex5 =  index5 + G_OFFSET
			const greenIndex6 =  index6 + G_OFFSET
			const greenIndex7 =  index7 + G_OFFSET
			const greenIndex8 =  index8 + G_OFFSET

			const blueIndex0 =  index0 + B_OFFSET
			const blueIndex1 =  index1 + B_OFFSET
			const blueIndex2 =  index2 + B_OFFSET
			const blueIndex3 =  index3 + B_OFFSET
			const blueIndex4 =  index4 + B_OFFSET
			const blueIndex5 =  index5 + B_OFFSET
			const blueIndex6 =  index6 + B_OFFSET
			const blueIndex7 =  index7 + B_OFFSET
			const blueIndex8 =  index8 + B_OFFSET

			const redIndex = index + R_OFFSET
			const greenIndex = index + G_OFFSET
			const blueIndex = index + B_OFFSET
			

			const redValue = (
				kernel[0][0]*computeMatrix[redIndex0] + kernel[0][1]*computeMatrix[redIndex1] + kernel[0][2]*computeMatrix[redIndex2] +
				kernel[1][0]*computeMatrix[redIndex3] + kernel[1][1]*computeMatrix[redIndex4] + kernel[1][2]*computeMatrix[redIndex5] +
				kernel[2][0]*computeMatrix[redIndex6] + kernel[2][1]*computeMatrix[redIndex7] + kernel[2][2]*computeMatrix[redIndex8]
			)/ ksum


			const greenValue = (
				kernel[0][0]*computeMatrix[greenIndex0] + kernel[0][1]*computeMatrix[greenIndex1] + kernel[0][2]*computeMatrix[greenIndex2] +
				kernel[1][0]*computeMatrix[greenIndex3] + kernel[1][1]*computeMatrix[greenIndex4] + kernel[1][2]*computeMatrix[greenIndex5] +
				kernel[2][0]*computeMatrix[greenIndex6] + kernel[2][1]*computeMatrix[greenIndex7] + kernel[2][2]*computeMatrix[greenIndex8]
			)/ ksum


			const blueValue = (
				kernel[0][0]*computeMatrix[blueIndex0] + kernel[0][1]*computeMatrix[blueIndex1] + kernel[0][2]*computeMatrix[blueIndex2] +
				kernel[1][0]*computeMatrix[blueIndex3] + kernel[1][1]*computeMatrix[blueIndex4] + kernel[1][2]*computeMatrix[blueIndex5] +
				kernel[2][0]*computeMatrix[blueIndex6] + kernel[2][1]*computeMatrix[blueIndex7] + kernel[2][2]*computeMatrix[blueIndex8]
			)/ ksum


			computeMatrix[redIndex] = clamp(redValue)
			computeMatrix[greenIndex] = clamp(greenValue)
			computeMatrix[blueIndex] = clamp(blueValue)

		}
	}
    
	postMessage({computeMatrix, height, i});
}


