let blockWidth = 20;
let blockHeight = 15;
let swatches = [];
let activeSwatch = 0;
let swatchButton0;
let swatchButton1;
let swatchButton2;
let swatchButton3;
let swatchButton4;
let swatchButton5;
let swatchButton6;
let swatchButton7;
let swatchButton8;

let importButton;
let frameAdvanceButton;
let canvas;
let frameInt=0;
let frameName= String(frameInt).padStart(2, '0');

let sourceImage; // this is the original photo/image we want to process
let sampleImage; // this is a resized version of the photo, where 1px = 1 block
let resultImage; // this is a p5Graphics objects that contains the results of the process

let swatchesPaths;
swatchesPaths = ['assets/macroblock/Block1.png','assets/macroblock/Block2.png','assets/macroblock/Block3.png','assets/macroblock/Block4.png','assets/macroblock/Block5.png','assets/macroblock/Block6.png','assets/macroblock/Block7.png','assets/macroblock/Block8.png','assets/macroblock/Block0.png'];
let hoverX = 0;
let hoverY = 0;

let snapX;
let snapY;

function preload(){
  // load all the swatches and the image we want to process
  loadSwatches();
  sourceImage = loadImage('assets/graytest.png');
}

function setup() {
   
  canvas = createCanvas(40 * blockWidth, 60 * blockHeight);
  
  
  canvas.parent('sketch');
  prepareImage();
  processImage();
}

function mouseClicked() {
 // resultImage.image(swatches[activeSwatch], mouseX * blockWidth, mouseY * blockHeight, blockWidth, blockHeight )
  
  
}

function advanceFrame(){
  console.log("this is where next frame would go");

}
function backFrame(){
  console.log("this is where last frame would go");

}
function playFrames(){
  console.log("this is where play frames would go");

}

function addFrames(){
  console.log("this is where add frame would go");

}

function keyPressed(){
  if(key === 'S' || key === 's'){
    save(resultImage, "test"+frameName+".png");
  }else if(keyCode === RIGHT_ARROW) {
    nextSwatch();
  }else if(keyCode === LEFT_ARROW) {
    prevSwatch();
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

function handleFile(file) {
  //print(file);
  if (file.type === 'image') {
    sourceImage = createImg(file.data, '');
    //img.hide();
    prepareImage();
    processImage();
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
      let swatchIndex = int(map(bri, 0, 100, 0, swatches.length));
      // make sure I'm within the bounds of the swatches array
      swatchIndex = constrain(swatchIndex, 0, swatches.length-1);
      // draw selected swatch onto the result graphics object at the correct position
      resultImage.image(swatches[swatchIndex], x * blockWidth, y * blockHeight, blockWidth, blockHeight );
    }
  }

}