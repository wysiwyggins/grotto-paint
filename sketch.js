let blockWidth = 10;
let blockHeight = 10;
let swatchesPaths = ['assets/Block0.png','assets/Block1.png','assets/Block2.png','assets/Block3.png','assets/Block4.png','assets/Block5.png',];
let swatches = [];
let activeSwatch = swatches[0];
let swatchButton0;
let swatchButton1;
let swatchButton2;
let swatchButton3;
let swatchButton4;
let swatchButton5;
let importButton;

let sourceImage; // this is the original photo/image we want to process
let sampleImage; // this is a resized version of the photo, where 1px = 1 block
let resultImage; // this is a p5Graphics objects that contains the results of the process

let hoverX = 0;
let hoverY = 0;

function preload(){
  // load all the swatches and the image we want to process
  loadSwatches();
  sourceImage = loadImage('assets/wiley.png');
}

function setup() {
  let canvas = createCanvas(120 * blockWidth, 64 * blockHeight);
  canvas.parent('sketch');
  swatchButton0 = document.getElementById('swatch0-button');
  swatchButton1 = document.getElementById('swatch1-button');
  swatchButton2 = document.getElementById('swatch2-button');
  swatchButton3 = document.getElementById('swatch3-button');
  swatchButton4 = document.getElementById('swatch4-button');
  swatchButton5 = document.getElementById('swatch4-button');
  importButton = document.getElementById('import-button');
  swatchButton0.addEventListener('click', setSwatch(0));
  swatchButton1.addEventListener('click', setSwatch(1));
  swatchButton2.addEventListener('click', setSwatch(2));
  swatchButton3.addEventListener('click', setSwatch(3));
  swatchButton4.addEventListener('click', setSwatch(4));
  swatchButton5.addEventListener('click', setSwatch(5));
  importButton.addEventListener('click', importImage);

  prepareImage();
  processImage();
}

function mouseClicked() {
 // drawImage = swatches[activeSwatch];
 // image(drawImage, hoverX, hoverY);
 save(resultImage, "test.png");
}

function draw() {
  background(220);
  image(resultImage, 0, 0);
  hoverX = mouseX / blockWidth;
  hoverY = mouseY / blockHeight;

  let c = sampleImage.get(sampleImage.width-1,0);
  fill(c);
  rect(mouseX, mouseY, 30,30);

}

function importImage(){ // NOTE: I'm not using this
  // browse for an image file
  //?
  let totalBrightness = 0;
  let blockBrightness = 0;
  for(x = 0 ; x < blockWidth ; x++ ){
    for(y = 0 ; y < blockHeight ; y++ ){
      let pixelColor = color(block.get(x,y));
      let pixelBrightness = brightness(pixelColor);
      totalBrightness += pixelBrightness;
    } 
  }
  //return ?
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

  sampleImage = createImage(sourceImage.width/blockWidth, sourceImage.height/blockHeight);
  sampleImage.copy(sourceImage, 0, 0, sourceImage.width, sourceImage.height, 0, 0, sampleImage.width, sampleImage.height);
  //sampleImage.save();
  // now sampleImage contains the original image but scaled down 

  // create an empy graphics object to render the results to
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
      console.log(bri);
      // draw selected swatch onto the result graphics object at the correct position
      resultImage.image(swatches[swatchIndex], x * blockWidth, y * blockHeight, blockWidth, blockHeight );
    }
  }

}