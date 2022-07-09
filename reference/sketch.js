let cols = 40;
let rows = 30; //this ought to be set by the json save files probably
//view icon is 20x20 I think
//fight animation is 40x60
//map is probably 40x30
//map icon could be 3x3 but most icons would be 1x2 inside that
let blockWidth = 20;
let blockHeight = 15;
let swatches = [];
let activeSwatch = 0;

let toolMode;

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
let loadData;

let sourceImage; // this is the original photo/image we want to process
let sampleImage; // this is a resized version of the photo, where 1px = 1 block
let resultImage; // this is a p5Graphics objects that contains the results of the process

let swatchesPaths;
swatchesPaths = ['assets/macroblock/Block1.png','assets/macroblock/Block2.png','assets/macroblock/Block3.png','assets/macroblock/Block4.png','assets/macroblock/Block5.png','assets/macroblock/Block6.png','assets/macroblock/Block7.png','assets/macroblock/Block8.png','assets/macroblock/Block0.png','assets/macroblock/Block9.png','assets/macroblock/Block10.png', 'assets/macroblock/Block11.png','assets/macroblock/Block12.png','assets/macroblock/Block13.png','assets/macroblock/Block14.png','assets/macroblock/Block15.png','assets/macroblock/Block16.png','assets/macroblock/Block17.png','assets/macroblock/Block18.png','assets/macroblock/Block19.png','assets/macroblock/Block20.png','assets/macroblock/Block21.png','assets/macroblock/Block22.png','assets/macroblock/Block23.png','assets/macroblock/Block24.png','assets/macroblock/Block25.png','assets/macroblock/Block26.png','assets/macroblock/Block27.png','assets/macroblock/Block28.png','assets/macroblock/Block29.png'];
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
  toolMode = 0;
  
  //frames[currentFrame] = frameMap;
}

function mouseClicked() {
 // resultImage.image(swatches[activeSwatch], mouseX * blockWidth, mouseY * blockHeight, blockWidth, blockHeight )
  
  
}

function loadSourceImage() {
  const fileInput = document.getElementById('imageInput'); //the button
  fileInput.onchange = () => {
    const myImageFile = fileInput.files[0];
    let urlOfImageFile = URL.createObjectURL(myImageFile);
    sourceImage = loadImage(urlOfImageFile, () => {newSourceImage()});
    
  }
}


function loadAnim(){
  const fileInput = document.getElementById('jsonInput'); //the button
  
  fileInput.onchange = () => {
    const myJsonFile = fileInput.files[0];
    let urlOfFile = URL.createObjectURL(myJsonFile);
    //load json here
    console.log("attempting to load");
   // console.log(urlOfFile);
   loadJSON(urlOfFile, parseJson, jsonFail);
  }
}


function saveAnim(){   /// JSON SAVING HERE
  // let testObject = "{"
  // var output = JSON.stringify(frames);
  // save(output, "animation.json");
  let json = {}; // new  JSON Object
  json.frameRate = 12;
  json.name = 'Wileys animationnnnnn';
  json.frameCount = frames.length;
  json.framesData = frames;
  saveJSON(json, 'testSave.json');
}

function parseJson(data){
  console.log("Json loaded succesfully");
  console.log("frame rate: " + data.frameRate );
  console.log("name: " + data.name );
  console.log("number of frames: " + data.frameCount);
  console.log("data: " + data.framesData);
  frames = [];
  frames = data.framesData;
  currentFrame = 0;
  loadFrame(currentFrame);
  updateFramesUI();

}

function jsonFail(){
  console.log("problem loading json");
}


function newSourceImage(){
  prepareImage(); // creates a scaled image to sample
  processImage(); // creates the tiled image and also populates de array with the correct swatch
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

function drawroom(exits, roomColor){
  //the simplest version of this would draw a square big enough to have the right number of exit paths
  //see https://wileywiggins.com//images/grotto/smallroom.png for an example
  //we probably need three layers going forward, the background tiles, color blocks under that, and a sprite layer on top?
  var wallTopTile = 7;
  var wallInnerFrontTile = 3;
  var wallOuterFrontTile = 0;
  var floorTile = 18;
  var doorTopTile = 21;
  var doorBottomTile = 22;

  //* figure out how many doors per side, and how long each side is
  var doorsPerSide = Math.ceil(doorsPerSide);
  var wallLength = (doorsPerSide *2)+1;

  //* figure out what the center column and row are
  var originX = cols/2;
  var originY = rows/2;
  
  //* space the doors apart from one another
  var gapValue = wallLength/(doorsPerSide +1)

  //try drawing
  //* begin drawing in the top left corner of the room, half of x subtracted from the center col


  console.log("drew a room");
}

function cyclePalette(){
  //addFrame();
  // I don't know why this isn't working yet and hopefully fixing it will lead to a more
  // usable add tile function that I need for room drawing etc.
  for(var i = 0; i < currentFrame.length; i++) {
    var thisCol = currentFrame[i];
    for(var j = 0; j < thisCol.length; j++) {
      var thisFrameTile = frames[currentFrame][thisCol][j];
      if(thisFrameTile < swatches.length){
        //frames[currentFrame][thisCol][j] +=1; 
        addTileToArray(thisFrameTile + 1, (thisCol), (j));
        resultImage.updatePixels();
      } else {
        //frames[currentFrame][thisCol][j] = 0;
        addTileToArray(0, (thisCol), (j));
        resultImage.updatePixels();
      }
    }
  }
  loadFrame(currentFrame);
}


function flipFrameHorizontal(){
  console.log("flip frame");
  //it will probably be useful to have a horizontal flip function for animation
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

  var playButton = document.getElementById("playButton")
  if(!frameTimer.isPlaying()){
    frameTimer.play();
    playButton.innerHTML ="⏸";
  }else{
    frameTimer.stop();
    playButton.innerHTML ="▶️";
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

function setTool(toolIndex){
  //there's not really any tools yet other than draw, but when there is this'll pick em
  const toolButton0 = document.getElementById('tool1-button');
  const toolButton1 = document.getElementById('tool2-button');
  
  toolMode = toolIndex;
  console.log("toolMode: " + toolMode);
  if (toolMode == 0) {
    toolButton0.classList.add("current");
    toolButton1.classList.remove("current");
  } else if ( toolMode == 1) {
    toolButton0.classList.remove("current");
    toolButton1.classList.add("current");
  } else if (toolMode > 1) {
    toolButton0.classList.remove("current");
    toolButton1.classList.add("current");
    toolMode =1;
  }
}



function saveFrame(){
  save(resultImage, "frame-"+currentFrame+".png");
}


//unused
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

function keyPressed(){
  if(key === 'S' || key === 's'){
    saveAnim()

  }else if(keyCode === RIGHT_ARROW) {

    advanceFrame();
  }else if(keyCode === LEFT_ARROW) {

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