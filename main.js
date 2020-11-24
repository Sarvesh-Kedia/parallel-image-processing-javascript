/* DOM setup */

const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')



const srcImage = new Image()
srcImage.src = "./Photo.jpg"



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
const arrSum = kernel =>
kernel.reduce(
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


showOriginal = function(){
	// var imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)

	// ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
	ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)

}


serialReflect = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width

	// For every pixel of the src image
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width/2; j++) {

			var index = getIndex(j, i)
			var index2 = getIndex(width-j, i)



			const redIndex =  index + R_OFFSET
			const greenIndex = index + G_OFFSET
			const blueIndex = index + B_OFFSET

			const redIndex2 =  index2 + R_OFFSET
			const greenIndex2 = index2 + G_OFFSET
			const blueIndex2 = index2 + B_OFFSET


			// swap the pixels in indiex1 and index2 for each colour

			var tempr = imagePixelMatrix[redIndex]
			var tempg = imagePixelMatrix[greenIndex]
			var tempb = imagePixelMatrix[blueIndex]

			imagePixelMatrix[redIndex] = imagePixelMatrix[redIndex2]
			imagePixelMatrix[greenIndex] = imagePixelMatrix[greenIndex2]
			imagePixelMatrix[blueIndex] = imagePixelMatrix[blueIndex2]

			imagePixelMatrix[redIndex2] = tempr
			imagePixelMatrix[greenIndex2] = tempg
			imagePixelMatrix[blueIndex2] = tempb

		}
	}

	console.log('updated imagePixelMatrix', imagePixelMatrix)

	commitChanges(imgData, imagePixelMatrix, width, height)
}

serialRotate = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()
	tempMatrix = imgData.data.slice()

	console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width

	// For every pixel of the src image
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {

			var index1 = getIndex(j, i)
			var index2 = getIndex(i, j)


			const redIndex1 =  index1 + R_OFFSET
			const greenIndex1 = index1 + G_OFFSET
			const blueIndex1 = index1 + B_OFFSET

			const redIndex2 =  index2 + R_OFFSET
			const greenIndex2 = index2 + G_OFFSET
			const blueIndex2 = index2 + B_OFFSET


			imagePixelMatrix[redIndex1] = tempMatrix[redIndex2]
			imagePixelMatrix[greenIndex1] = tempMatrix[greenIndex2]
			imagePixelMatrix[blueIndex1] = tempMatrix[blueIndex2]

		}
	}

	console.log('updated imagePixelMatrix', imagePixelMatrix)

	commitChanges(imgData, imagePixelMatrix, height, width)
}

serialGrayScale = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width

	// For every pixel of the src image
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {

			
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

	commitChanges(imgData, imagePixelMatrix, width, height)
}


serialInvert = function(){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width

	// For every pixel of the src image
	console.log(srcImage.height, srcImage.width)

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {

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

	commitChanges(imgData, imagePixelMatrix, width, height)
}


serialImageConvolution = function(kern){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()

	let kernel = kern



	ksum = arrSum(kernel)

	console.log(ksum)

	console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width



	// For every pixel of the src image
	for (let i = 1; i < height-1; i++) {
		for (let j = 1; j < width-1; j++) {
			
			
			var index = getIndex(j, i)


			var index0 = getIndex(j-1, i-1)
			var index1 = getIndex(j, i-1)
			var index2 = getIndex(j+1, i-1)
			var index3 = getIndex(j-1, i)
			var index4 = getIndex(j, i)
			var index5 = getIndex(j+1, i)
			var index6 = getIndex(j-1, i+1)
			var index7 = getIndex(j, i+1)
			var index8 = getIndex(j+1, i+1)


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
				kernel[0][0]*imagePixelMatrix[redIndex0] + kernel[0][1]*imagePixelMatrix[redIndex1] + kernel[0][2]*imagePixelMatrix[redIndex2] +
				kernel[1][0]*imagePixelMatrix[redIndex3] + kernel[1][1]*imagePixelMatrix[redIndex4] + kernel[1][2]*imagePixelMatrix[redIndex5] +
				kernel[2][0]*imagePixelMatrix[redIndex6] + kernel[2][1]*imagePixelMatrix[redIndex7] + kernel[2][2]*imagePixelMatrix[redIndex8]
			)/ ksum


			const greenValue = (
				kernel[0][0]*imagePixelMatrix[greenIndex0] + kernel[0][1]*imagePixelMatrix[greenIndex1] + kernel[0][2]*imagePixelMatrix[greenIndex2] +
				kernel[1][0]*imagePixelMatrix[greenIndex3] + kernel[1][1]*imagePixelMatrix[greenIndex4] + kernel[1][2]*imagePixelMatrix[greenIndex5] +
				kernel[2][0]*imagePixelMatrix[greenIndex6] + kernel[2][1]*imagePixelMatrix[greenIndex7] + kernel[2][2]*imagePixelMatrix[greenIndex8]
			)/ ksum


			const blueValue = (
				kernel[0][0]*imagePixelMatrix[blueIndex0] + kernel[0][1]*imagePixelMatrix[blueIndex1] + kernel[0][2]*imagePixelMatrix[blueIndex2] +
				kernel[1][0]*imagePixelMatrix[blueIndex3] + kernel[1][1]*imagePixelMatrix[blueIndex4] + kernel[1][2]*imagePixelMatrix[blueIndex5] +
				kernel[2][0]*imagePixelMatrix[blueIndex6] + kernel[2][1]*imagePixelMatrix[blueIndex7] + kernel[2][2]*imagePixelMatrix[blueIndex8]
			)/ ksum


			imagePixelMatrix[redIndex] = clamp(redValue)
			imagePixelMatrix[greenIndex] = clamp(greenValue)
			imagePixelMatrix[blueIndex] = clamp(blueValue)

		}
	}

	console.log('updated imagePixelMatrix', imagePixelMatrix)

	commitChanges(imgData, imagePixelMatrix, width, height)
}

