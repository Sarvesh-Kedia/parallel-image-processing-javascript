document.writeln("<script type='text/javascript' src='./Workers/reflectWorker.js'></script>");
document.writeln("<script type='text/javascript' src='./Workers/grayScaleWorker.js'></script>");


parallelReflect = function(workerNum=4){
	
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
            workers = new Worker("./Workers/reflectWorker.js");
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


parallelGrayScale = function(workerNum=4){
	
	// Get an ImageData object representing the underlying pixel data for the area of the canvas
	imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)


	// .data gets the array of integers with 0-255 range, .slice returns a copy of the array 
	imagePixelMatrix = imgData.data.slice()


	console.log('imagePixelMatrix', imagePixelMatrix)

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

                console.log("parallel reflect time: ", t1-t0)

			}
        }
        
    }

}


