let _roomTiles;
let _tileMap;

let app = new PIXI.Application({
  width: 512,
  height: 512,
  backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
app.loader.add(["assets/tiles2x.png"]).load(setup);

function setup() {
  _roomTiles = new PIXI.tilemap.CompositeRectTileLayer(
    0,
    PIXI.utils.TextureCache["assets/tiles2x.png"]
  );
  app.stage.addChild(_roomTiles);
  loadMap("assets/maps/exitAction2x.tmj");
}

async function loadMap(url) {
  const response = await fetch(url);
  _tileMap = await response.json();

  app.width = _tileMap.width * _tileMap.tilewidth;
  app.height = _tileMap.height * _tileMap.tileheight;

  var tileTexture = PIXI.utils.TextureCache["assets/tiles2x.png"];
  for (var y = 0; y < _tileMap.height; y++) {
    for (var x = 0; x < _tileMap.width; x++) {
      var tileNum = _tileMap.layers[0].data[x + _tileMap.width * y];
      if (tileNum < 2399) {
        var tileX = parseInt(tileNum % _tileMap.width) * _tileMap.tilewidth;
        var tileY = parseInt(tileNum / _tileMap.height) * _tileMap.tileheight;
        tileTexture.frame = new PIXI.Rectangle(
          tileX,
          tileY,
          tileX + _tileMap.tilewidth,
          tileY + _tileMap.tileheight
        );

        var rectangle = PIXI.Sprite.from(tileTexture);
        rectangle.x = x * _tileMap.tilewidth;
        rectangle.y = y * _tileMap.tileheight;
        rectangle.width = _tileMap.tilewidth;
        rectangle.height = _tileMap.tileheight;
        rectangle.tint = 0xff0000;
        app.stage.addChild(rectangle);

        console.log(`x: ${x} / y: ${y} / tile ${tileNum}`);
      }
    }
  }
}
