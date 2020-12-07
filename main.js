document.writeln("<script type='text/javascript' src='./serial.js'></script>");
document.writeln("<script type='text/javascript' src='./parallel.js'></script>");


/* DOM setup */

const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const srcImage = new Image()
srcImage.src = "./Photos/Photo2.jpg"



// The image is stored as a 1d array with red first, then green, and blue 
const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2
const A_OFFSET = 3


// Given the x, y index, return what position it should be in a 1d array
function getIndex(x, y) {
	return (x + y * srcImage.width) * 4
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


// When user selects a new image
fileinput.onchange = function (e) {

	// If it is valid
	if (e.target.files && e.target.files.item(0)) {

	// Set the src of the new Image() we created in javascript
	srcImage.src = URL.createObjectURL(e.target.files[0])
	}
}


srcImage.onload = function () {

	// Copy the image's dimensions to the canvas, which will show the preview of the edits
	canvas.width = srcImage.width
	canvas.height = srcImage.height

	// draw the image at with no offset (0,0) and with the same dimensions as the image
	ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)

}


// Transfers the changes we made to be displayed on the canvas
function commitChanges(finalImgData, newImagePixelMatrix, width, height) {
	// Copy over the current pixel changes to the image
	for (let i = 0; i < finalImgData.data.length; i++) {
	finalImgData.data[i] = newImagePixelMatrix[i]
	}


	// Update the 2d rendering canvas with the image we just updated so the user can see
	ctx.putImageData(finalImgData, 0, 0, 0, 0, width, height)
}

function test(workerNum){


	console.log("serial reflect time: ", serialReflect())

	// parallelReflect(workerNum)

	console.log("serial grayscale time: ", serialGrayScale())

	// parallelGrayScale(workerNum)

	console.log("serial invert time: ", serialInvert())

	// parallelInvert(workerNum)

	console.log("serial convolution time: ", serialImageConvolution([[1, 1, 1], [1, 1, 1], [1, 1, 1]]))

	// parallelImageConvolution([[1, 1, 1], [1, 1, 1], [1, 1, 1]], workerNum)




}

showOriginal = function(){
	// var imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)

	// ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
	ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)

}



