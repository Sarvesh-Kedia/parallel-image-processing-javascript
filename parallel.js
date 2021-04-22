document.writeln("<script type='text/javascript' src='./Workers/reflectWorker.js'></script>");
document.writeln("<script type='text/javascript' src='./Workers/grayScaleWorker.js'></script>");
document.writeln("<script type='text/javascript' src='./Workers/invertWorker.js'></script>");
document.writeln("<script type='text/javascript' src='./Workers/convolutionWorker.js'></script>");

const num = 4
console.log(num)
parallelReflect = function(workerNum=num){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	// console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
    var width = srcImage.width
    
    var workers, running=0;

    var splitSize = height/workerNum

    // console.log(splitSize)

    // each pixel works on size no of pixels
    size = height*4*width/workerNum

    t0 = performance.now()

    if (window.Worker) {

        for(var i=0; i<workerNum; ++i){
            // console.log('new worker', i)
            workers = new Worker("./Workers/reflectWorker.js");
            ++running;
            workers.onmessage = workerDone;
            workers.postMessage({computeMatrix: imagePixelMatrix, width: width, height: (i+1)*splitSize, i: i});
        }

        function workerDone(e) {
            --running;

            // console.log('worker done', e.data.i)
            
            computeMatrix = e.data.computeMatrix
            height = e.data.height
            i = e.data.i
            // console.log(height, i)

            // console.log(i*size, height*4*width, height, size)


            for(var p=i*size; p<height*4*width; ++p){
                imagePixelMatrix[p] = computeMatrix[p]
            }

            // console.log("a worker is done")

			if (running === 0) { // <== There is no race condition here, see below
                
                // console.log('updated imagePixelMatrix', imagePixelMatrix)
                commitChanges(imgData, imagePixelMatrix, width, height)
                t1 = performance.now()

                console.log("parallel reflect time: ", t1-t0)

			}
        }
        
    }



}


parallelGrayScale = function(workerNum=num){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	// console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
    var width = srcImage.width

    var workers, running=0;

    var splitSize = height/workerNum

    // console.log(splitSize)

    // each pixel works on size no of pixels
    size = height*4*width/workerNum
    

    t0 = performance.now()

    if (window.Worker) {

        for(var i=0; i<workerNum; ++i){
            workers = new Worker("./Workers/grayScaleWorker.js");
            ++running;
            workers.onmessage = workerDone;
            workers.postMessage({computeMatrix: imagePixelMatrix, width: width, height: (i+1)*splitSize, i: i});
        }

        function workerDone(e) {
            --running;
            
            computeMatrix = e.data.computeMatrix
            height = e.data.height
            i = e.data.i
            // console.log(height, i)


            for(var p=i*size; p<height*4*width; ++p){
                imagePixelMatrix[p] = computeMatrix[p]
            }

            // console.log("a worker is done")

			if (running === 0) { // <== There is no race condition here, see below
                
                // console.log('updated imagePixelMatrix', imagePixelMatrix)
                commitChanges(imgData, imagePixelMatrix, width, height)
                t1 = performance.now()

                console.log("parallel grayscale time: ", t1-t0)

			}
        }
        
    }

}


parallelInvert = function(workerNum=num){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	// console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
    var width = srcImage.width

    var workers, running=0;

    var splitSize = height/workerNum

    // console.log(splitSize)

    // each pixel works on size no of pixels
    size = height*4*width/workerNum
    

    t0 = performance.now()

    if (window.Worker) {

        for(var i=0; i<workerNum; ++i){
            workers = new Worker("./Workers/invertWorker.js");
            ++running;
            workers.onmessage = workerDone;
            workers.postMessage({computeMatrix: imagePixelMatrix, width: width, height: (i+1)*splitSize, i: i});
        }

        function workerDone(e) {
            --running;
            
            computeMatrix = e.data.computeMatrix
            height = e.data.height
            i = e.data.i
            // console.log(height, i)


            for(var p=i*size; p<height*4*width; ++p){
                imagePixelMatrix[p] = computeMatrix[p]
            }

            // console.log("a worker is done")

			if (running === 0) { // <== There is no race condition here, see below
                
                // console.log('updated imagePixelMatrix', imagePixelMatrix)
                commitChanges(imgData, imagePixelMatrix, width, height)
                t1 = performance.now()

                console.log("parallel invert time: ", t1-t0)

			}
        }
        
    }

}

// kernel dimension should be > splitSize
parallelImageConvolution = function(kern, workerNum=num){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()

	let kernel = kern

	ksum = arrSum(kernel)

	// console.log(ksum)

	// console.log('imagePixelMatrix', imagePixelMatrix)

	var height = srcImage.height
	var width = srcImage.width


    var workers, running=0;

    var splitSize = height/workerNum

    // console.log(splitSize)

    // each pixel works on size no of pixels
    size = height*4*width/workerNum
    

    t0 = performance.now()
    if (window.Worker) {

        for(var i=0; i<workerNum; ++i){
            console.log()
            workers = new Worker("./Workers/convolutionWorker.js");
            ++running;
            workers.onmessage = workerDone;
            workers.postMessage({computeMatrix: imagePixelMatrix, width: width, height: (i+1)*splitSize, i: i, ksum: ksum, kernel: kernel});
        }

        function workerDone(e) {
            --running;
            
            computeMatrix = e.data.computeMatrix
            height = e.data.height
            i = e.data.i
            // console.log(height, i)


            for(var p=i*size; p<height*4*width; ++p){
                imagePixelMatrix[p] = computeMatrix[p]
            }

            // console.log("a worker is done")

			if (running === 0) { // <== There is no race condition here, see below
                
                // console.log('updated imagePixelMatrix', imagePixelMatrix)
                commitChanges(imgData, imagePixelMatrix, width, height)
                t1 = performance.now()

                console.log("parallel convolution time: ", t1-t0)

			}
        }
        
    }


}