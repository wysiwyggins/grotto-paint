let cols = 40;
let rows = 30;
let blockWidth = 20;
let blockHeight = 15;
let swatches = [];
let activeSwatch = 0;

//frameMap is one frame of all the swatch indexes in an image
//let frameMap = [];
//frames is all the frames of frameMaps. These would all go into the json output
let frames = [];

let importButton;
let frameAdvanceButton;
let frameBackButton;
let frameAddButton;
let PlayButton;
let SaveButton;
let canvas;
let currentFrame;

let sourceImage; // this is the original photo/image we want to process
let sampleImage; // this is a resized version of the photo, where 1px = 1 block
let resultImage; // this is a p5Graphics objects that contains the results of the process

let swatchesPaths;
swatchesPaths = ['assets/macroblock/Block1.png','assets/macroblock/Block2.png','assets/macroblock/Block3.png','assets/macroblock/Block4.png','assets/macroblock/Block5.png','assets/macroblock/Block6.png','assets/macroblock/Block7.png','assets/macroblock/Block8.png','assets/macroblock/Block0.png','assets/macroblock/Block9.png','assets/macroblock/Block10.png', 'assets/macroblock/Block11.png','assets/macroblock/Block12.png','assets/macroblock/Block13.png','assets/macroblock/Block14.png','assets/macroblock/Block15.png','assets/macroblock/Block16.png','assets/macroblock/Block17.png','assets/macroblock/Block18.png','assets/macroblock/Block19.png','assets/macroblock/Block20.png','assets/macroblock/Block21.png','assets/macroblock/Block22.png'];
let hoverX = 0;
let hoverY = 0;

let snapX;
let snapY;

let frameTimer;

function array2d(width, height, value = 8) {
  //this was loren's way of filling a 2d array, swatch 8 is a white tile
  let array = Array.from(Array(width), () => new Array(height).fill(value))
  array.width = cols; array.height = rows;
  return array
}

function preload(){
  // load all the swatches and the image we want to process
  loadSwatches();
  sourceImage = loadImage('assets/graytest.png');
  
}

function setup() {
   
  canvas = createCanvas(cols * blockWidth, rows * blockHeight);
  
  canvas.parent('sketch');
  currentFrame = 0;
  prepareImage();
  frames[0] = array2d(sampleImage.width,sampleImage.height); // creates an empty array
  processImage();

  frameTimer = new FpsTimer();
  frameTimer.setFrameRate(12);
  
  
  //frames[currentFrame] = frameMap;
}

function mouseClicked() {
 // resultImage.image(swatches[activeSwatch], mouseX * blockWidth, mouseY * blockHeight, blockWidth, blockHeight )
  
  
}


function loadFrame(thisFrameIndex){
  let thisFrame = frames[thisFrameIndex];
  console.log("loadingFrame " + thisFrameIndex);
  resultImage.clear();
  for(var i = 0; i < thisFrame.length; i++) {
    var thisCol = thisFrame[i];
    for(var j = 0; j < thisCol.length; j++) {
       //paint a tile here
       resultImage.image(swatches[thisCol[j]], i * blockWidth, j * blockHeight, blockWidth, blockHeight );
    }
  }
}

function updateFramesUI(){
  console.log("frame " + (currentFrame ));
  console.log("total frames" + frames.length);
  let frameText = document.getElementById('currentFrameText');
  let totalFramesText = document.getElementById('totalFramesText');
  frameText.innerHTML = (currentFrame + 1);
  totalFramesText.innerHTML = frames.length;
  
}

function advanceFrame(){
  console.log("next");
  if (currentFrame < frames.length-1){
    currentFrame +=1;
    //frameMap = frames[currentFrame];
    //console.log(frameMap); 
    loadFrame(currentFrame);
  }else{
    currentFrame = 0;
    loadFrame(currentFrame);
  }
  updateFramesUI();
}

function backFrame(){
  console.log("back");
  if (currentFrame > 0){
    currentFrame -=1;
   // frameMap = frames[currentFrame];
    loadFrame(currentFrame);
  }else{
    currentFrame = frames.length -1;
    loadFrame(currentFrame);
  }
  updateFramesUI();
}

function playFrames(){
  //console.log("this is where play frames would go");
  // if playing, pause
  // if not playing, play
  if(!frameTimer.isPlaying()){
    frameTimer.play();
  }else{
    frameTimer.stop();
  }


}

function addFrame(){
  console.log("add");
  //frames[currentFrame + 1] = array2d(sampleImage.width,sampleImage.height);
  
  //frames[currentFrame] = frames[currentFrame-1]; // THIS IS THE PROBLEM NOW
  let tempFrame = array2d(sampleImage.width,sampleImage.height);
  for(let x = 0 ; x < frames[currentFrame].length ; x++){
    for(let y = 0 ; y < frames[currentFrame][x].length ; y++){
      tempFrame[x][y] = frames[currentFrame][x][y];
    }
  }
  
  frames.splice(currentFrame+1,0,tempFrame);

  currentFrame +=1;
  loadFrame(currentFrame);
  updateFramesUI()
}


function save(){
  save(resultImage, "test"+currentFrame+".png");
  //and also get the json
  var output = JSON.stringify(frames);
  save(output, "animation.json");
}

function keyPressed(){
  if(key === 'S' || key === 's'){
    save()

  }else if(keyCode === RIGHT_ARROW) {
    //nextSwatch();
    advanceFrame();
  }else if(keyCode === LEFT_ARROW) {
   //prevSwatch();
   backFrame();
  }
  else if(key === ' ') {
    playFrames();
   }
}

function nextSwatch(){
  activeSwatch ++;
  if(activeSwatch > swatches.length - 1){
    activeSwatch = 0;
  }
}

function prevSwatch(){
  activeSwatch --;
  if(activeSwatch < 0){
    activeSwatch = swatches.length - 1;
  }
}

function draw() {
  background(255);

  frameTimer.update();
  if(frameTimer.isPlaying()){
    if(frameTimer.checkChange()){
      frameTimer.lowerFlag();
      advanceFrame();
     // console.log("new frame");
      /// advanceOneFrame
    }
  }

  image(resultImage, 0, 0);
  hoverX = mouseX / blockWidth;
  hoverY = mouseY / blockHeight;
  handleBrush();
 
}


function handleBrush(){
  snapX = int(mouseX / blockWidth) * blockWidth;
  snapY = int(mouseY / blockHeight) * blockHeight;
  if(mouseX < resultImage.width && mouseY < resultImage.height){

    if(mouseIsPressed){
      resultImage.loadPixels();
      for(let x = 0 ; x < blockWidth ; x++){
        for(let y = 0 ; y < blockHeight ; y++){
          resultImage.set(snapX + x, snapY + y, color(0,0,0,0));
        }
      }
      resultImage.updatePixels();
      resultImage.image(swatches[activeSwatch], snapX, snapY, blockWidth, blockHeight);
      addTileToArray(activeSwatch, (snapX/blockWidth), (snapY/blockHeight));
    }else{
      push();
      // red rectangle around active tile
      stroke(255, 0, 0);
      noFill();
      rect(snapX, snapY, blockWidth, blockHeight);
      // white background to preview new tile
      fill(255);
      noStroke();
      rect(snapX, snapY, blockWidth, blockHeight);
      // new tile preview
      image(swatches[activeSwatch], snapX, snapY, blockWidth, blockHeight );
      pop();
    }
  }
}

function addTileToArray(swatchIndex, col, row){
  frames[currentFrame][col][row]=swatchIndex;
  //frames[currentFrame] = frameMap;
 // console.log("col: " + col);
 // console.log("row: " + row);
 // console.log("index: " + swatchIndex);
  
}

function handleFile(file) {
  //print(file);
  if (file.type === 'image') {
    sourceImage = createImg(file.data, '');
    //img.hide();
    prepareImage(); // creates a scaled image to sample
    processImage(); // creates the tiled image and also populates de array with the correct swatch
  } else {
    sourceImage = null;
  }
}

function setSwatch(swatchNumber) {
  activeSwatch = swatchNumber;
  console.log("new swatch " + swatchNumber  );
}

function loadSwatches(){
  for(let i = 0 ; i < swatchesPaths.length ; i++){
    swatches[i] = loadImage(swatchesPaths[i]);
  }
  console.log("LOADED " + swatches.length + " TILES");
}



function prepareImage(){
  // resize the source image to fit the canvas
 
  sourceImage.resize(width,0);
 
  if(sourceImage.height > height){
    sourceImage.resize(0,height);
  }
  // make a copy of it in sampleImage, where 1px = 1 block

  sampleImage = createImage(int(sourceImage.width/blockWidth), int(sourceImage.height/blockHeight));
  sampleImage.copy(sourceImage, 0, 0, sourceImage.width, sourceImage.height, 0, 0, sampleImage.width, sampleImage.height);
  //sampleImage.save();
  // now sampleImage contains the original image but scaled down 
 
  // we should talk about this step later cause it's kind of an ugly fix to a problem I found 
  sourceImage.resize(sampleImage.width * blockWidth, sampleImage.height * blockHeight);

  // create an empty graphics object to render the results to
  resultImage = createGraphics(sourceImage.width, sourceImage.height);

}

function processImage(){
  // going pixel by pixel in the sample image
  // getting the brightness for each pixel
  // and drawing the correspondent block in the scaled up resultImage graphics element
  resultImage.clear();
  resultImage.reset();
  for(let x = 0 ; x < sampleImage.width ; x ++){
    for(let y = 0 ; y < sampleImage.height ; y ++){
      let pixelColor = sampleImage.get(x,y);
      let bri = brightness(pixelColor);
      
      // figure out which swatch to use
      let swatchIndex = int(map(bri, 0, 100, 0, 8));
      // make sure I'm within the bounds of the swatches array
      swatchIndex = constrain(swatchIndex, 0, swatches.length-1);


      // draw selected swatch onto the result graphics object at the correct position
      resultImage.image(swatches[swatchIndex], x * blockWidth, y * blockHeight, blockWidth, blockHeight );

      // figure out what column and row this is
      // store swatchIndex at that position

      frames[currentFrame][x][y]=swatchIndex;


    }
  }

}
