/* DOM setup */

const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const srcImage = new Image()
srcImage.src = "./Photo.jpg"




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


showOriginal = function(){
	// var imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)

	// ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
	ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)

}

// Transfers the changes we made to be displayed on the canvas
function commitChanges(finalImgData, newImagePixelMatrix) {
	
	// Copy over the current pixel changes to the image
	for (let i = 0; i < finalImgData.data.length; i++) {
	finalImgData.data[i] = newImagePixelMatrix[i]
	}

	// Update the 2d rendering canvas with the image we just updated so the user can see
	ctx.putImageData(finalImgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
}



serialGrayScale = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)


	// For every pixel of the src image
	for (let i = 0; i < srcImage.height; i++) {
		for (let j = 0; j < srcImage.width; j++) {

			
			var index = getIndex(j, i)
		
			const redIndex =  index + R_OFFSET
			const greenIndex = index + G_OFFSET
			const blueIndex = index + B_OFFSET
			
			const redValue = imagePixelMatrix[redIndex]
			const greenValue = imagePixelMatrix[greenIndex]
			const blueValue = imagePixelMatrix[blueIndex]

			const mean = (redValue + greenValue + blueValue) / 3

			imagePixelMatrix[redIndex] = clamp(mean)
			imagePixelMatrix[greenIndex] = clamp(mean)
			imagePixelMatrix[blueIndex] = clamp(mean)

		}
	}

	console.log('updated imagePixelMatrix', imagePixelMatrix)

	commitChanges(imgData, imagePixelMatrix)
}


serialInvert = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)


	// For every pixel of the src image

	console.log(srcImage.height, srcImage.width)

	for (let i = 0; i < srcImage.height; i++) {
		for (let j = 0; j < srcImage.width; j++) {

			var index = getIndex(j, i)
		
			const redIndex =  index + R_OFFSET
			const greenIndex = index + G_OFFSET
			const blueIndex = index + B_OFFSET
		
			const redValue = 255 - imagePixelMatrix[redIndex]
			const greenValue = 255 - imagePixelMatrix[greenIndex]
			const blueValue = 255 - imagePixelMatrix[blueIndex]

			imagePixelMatrix[redIndex] = redValue
			imagePixelMatrix[greenIndex] = greenValue
			imagePixelMatrix[blueIndex] = blueValue

		}

		
	}

	console.log('updated imagePixelMatrix', imagePixelMatrix)

	commitChanges(imgData, imagePixelMatrix)
}



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