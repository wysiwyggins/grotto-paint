let blockWidth = 10;
let blockHeight = 10;
let swatches = ['assets/Block0.png','assets/Block1.png','assets/Block2.png','assets/Block3.png','assets/Block4.png','assets/Block5.png',];
let activeSwatch = swatches[0];
let swatchButton0;
let swatchButton1;
let swatchButton2;
let swatchButton3;
let swatchButton4;
let swatchButton5;
let importButton;


let hoverX = 0;
let hoverY = 0;

function setup() {
  let canvas = createCanvas(120 * blockWidth, 64 * blockHeight);
  canvas.parent('sketch');
}

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

function mouseClicked() {
  drawImage = loadImage(activeSwatch);
  image(drawImage, hoverX, hoverY);
}

function draw() {
  background(220);
  hoverX = mouseX / blockWidth;
  hoverY = mouseY / blockHeight;
  
}

function importImage(){
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
  activeSwatch = swatches[swatchNumber];
}