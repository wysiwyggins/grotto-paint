let cols = 40;
let rows = 30; //this ought to be set by the json save files probably

//map is 40x30

let blockWidth = 20;
let blockHeight = 15;
let swatches = [];
let activeSwatch = 0;

let toolMode;

//frameMap is one frame of all the swatch indexes in an image
//let frameMap = [];
//frames is all the frames of frameMaps. These would all go into the json output
let frames = [];
let frames1d = [];

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
swatchesPaths = ['assets/tiles/Block175.png','assets/tiles/Block156.png','assets/tiles/Block155.png','assets/tiles/Block123.png','assets/tiles/Block124.png','assets/tiles/Block154.png','assets/tiles/Block149.png','assets/tiles/Block0.png',];
let hoverX = 0;
let hoverY = 0;

let snapX;
let snapY;

let frameTimer;

let extraMetaData;
let tileMappings;


function array2d(width, height, value = 8) {
  //this was loren's way of filling a 2d array, swatch 8 is a white tile
  let array = Array.from(Array(width), () => new Array(height).fill(value))
  array.width = cols; array.height = rows;
  return array
}

function preload(){
  // load all the swatches and the image we want to process
  loadSwatches();
  sourceImage = loadImage('assets/gray.png');
  extraMetaData = loadJSON('assets/junk.json');
  tileMappings = loadStrings('assets/tileMappings.txt');
  
}


function setup() {

  //console.log(tileMappings);
   
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

  const whenButtons1 = document.querySelectorAll('.when');
  const thenButtons1 = document.querySelectorAll('.then');

  const spriteGrid = select('.sprite-grid');

  whenButtons1.forEach(button => {
    button.addEventListener('click', function() {
      let index = this.dataset.index;
      this.style.backgroundImage = `url("/assets/tiles/Block${activeSwatch}.png")`;
      console.log("I tried changing a button background");
    });
  });

  thenButtons1.forEach(button => {
    button.addEventListener('click', function() {
      let index = this.dataset.index;
      this.style.backgroundImage = `url("/assets/tiles/Block${activeSwatch}.png")`;
      console.log("I tried changing a button background");
    });
  });

  

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



function parseJson(data){
  console.log("Json loaded succesfully");
  console.log("frame rate: " + data.frameRate );
  console.log("name: " + data.name );
  console.log("number of frames: " + data.frameCount);
  console.log("data: " + data.layers);
  frames = [];
  frames = data.layers;
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

function saveAnim(){   /// JSON SAVING HERE
  // let testObject = "{"
  // var output = JSON.stringify(frames);
  // save(output, "animation.json");
  let json = {}; // new  JSON Object
  //json.frameRate = 12;
  //json.name = 'Wileys animationnnnnn';
  //let frames1d = convert2dArrayTo1dArray(frames);

  json = extraMetaData;
 
  json.compressionlevel = -1;
  json.height= 30;
  json.infinite = false;
  //json.frameCount = frames.length;
  json.layers = []
  //json.layers.push({data : frames}); //the old 2d one

  for(let i = 0 ; i < frames.length ; i++){
    let currentFrame = get1Frame(i, frames);
    json.layers.push({data : currentFrame}); //this still looked like the 2d array???
    json.layers[i].height = rows;
    json.layers[i].id = i;
    json.layers[i].name = "frame " + i;
    json.layers[i].opacity = 1;
    json.layers[i].type = "tilelayer";
    json.layers[i].visible = true;
    json.layers[i].width = cols;
    json.layers[i].x = 0;
    json.layers[i].y = 0;


  }
  //saveJSON(json, 'testSave.json');
 
  saveJSON(json, 'testSave.json');
}

function get1Frame(index, frames){
  let frameAs1dArray = convert2dArrayTo1dArray(frames[index]);
  //console.log(frames[index]);
  return(frameAs1dArray);

}


function convert2dArrayTo1dArray(twoDimensionalArray){ // twoDimensionalArray is "frames"
  //yes it's crazy that we are making a 2d array and then converting it to 
  //1d w height instead of just making a 1d height array maybe refactor later
  let oneDimensionalArray = [];
  console.log(twoDimensionalArray);
 
  for (let y = 0; y < twoDimensionalArray[0].length; y++) {
  for (let x = 0; x < twoDimensionalArray.length; x++) {
     
        // Push the current element onto the one-dimensional array
        let unMappedTile = twoDimensionalArray[x][y];
        console.log(unMappedTile);
        let row = split(tileMappings[unMappedTile], ",");
        let mappedTile = row[1];
        oneDimensionalArray.push(mappedTile);
        //console.log(twoDimensionalArray[i][j]);
    }
  }
  return oneDimensionalArray;
}



