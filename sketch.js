let blockWidth = 20;
let blockHeight = 15;
let small = false;
let swatches = [];
let activeSwatch = swatches[0];
let swatchButton0;
let swatchButton1;
let swatchButton2;
let swatchButton3;
let swatchButton4;
let swatchButton5;
let swatchButton6;
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

function preload(){
  // load all the swatches and the image we want to process
  loadSwatches();
  sourceImage = loadImage('assets/vic.png');
}

function setup() {
   
  if (small == false){
    canvas = createCanvas(60 * blockWidth, 40 * blockHeight);
  } else {
    canvas = createCanvas(10 * blockWidth, 12 * blockHeight);
  }
  
  canvas.parent('sketch');
  swatchButton0 = document.getElementById('swatch0-button');
  swatchButton1 = document.getElementById('swatch1-button');
  swatchButton2 = document.getElementById('swatch2-button');
  swatchButton3 = document.getElementById('swatch3-button');
  swatchButton4 = document.getElementById('swatch4-button');
  swatchButton5 = document.getElementById('swatch5-button');
  swatchButton6 = document.getElementById('swatch6-button');
  swatchButton7 = document.getElementById('swatch6-button');
  swatchButton8 = document.getElementById('swatch6-button');
  swatchButton0.addEventListener('click', setSwatch(0));
  swatchButton1.addEventListener('click', setSwatch(1));
  swatchButton2.addEventListener('click', setSwatch(2));
  swatchButton3.addEventListener('click', setSwatch(3));
  swatchButton4.addEventListener('click', setSwatch(4));
  swatchButton5.addEventListener('click', setSwatch(5));
  swatchButton5.addEventListener('click', setSwatch(6));
  frameAdvanceButton = document.getElementById('increment');
  frameAdvanceButton.addEventListener('click', advanceFrame());
  prepareImage();
  processImage();
}

function mouseClicked() {
  resultImage.image(swatches[activeSwatch], mouseX * blockWidth, mouseY * blockHeight, blockWidth, blockHeight )
}

function advanceFrame(){
  frameInt +=1;
  frameName = String(frameInt).padStart(2, '0');
  //sourceImage = loadImage('assets/candle/'+frameName+'.png');
  //prepareImage();
  //processImage();
}

function keyPressed(){
  if(key === 'S' || key === 's'){
    save(resultImage, "test"+frameName+".png");
  }
}

function draw() {
  background(255);
  image(resultImage, 0, 0);
  hoverX = mouseX / blockWidth;
  hoverY = mouseY / blockHeight;
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
}

function loadSwatches(){
  for(let i = 0 ; i < swatchesPaths.length ; i++){
    swatches[i] = loadImage(swatchesPaths[i]);
  }
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