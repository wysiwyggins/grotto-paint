let app = new PIXI.Application(
  { 
    width: 256,
    height: 256,
    backgroundColor: 0xFFFFFF
  });
document.body.appendChild(app.view);

let _tileset;
app.loader.add("assets/tileset.png").load(setup);

function setup() {
  let resources = app.loader.resources;
  _tileset = new PIXI.Sprite(resources["assets/tileset.png"].texture);
  app.stage.addChild(_tileset);
}

let _tileMap;
async function loadMap(url) {
  const response = await fetch(url);
  _tileMap = await response.json();

  app.width = _tileMap.width*_tileMap.tileWidth;
  app.height = _tileMap.height*_tileMap.tileHeight;

  for (var y = 0; y < _tileMap.height; y++) {
    for (var x = 0; x < _tileMap.width; x++) {
      console.log(`x: ${x} / y: ${y} / tile ${_tileMap.layers[0].data[x+(x*y)]}`);
    }
  }
}
loadMap("assets/maps/prototype.tmj");
// console.log(tileMap);

