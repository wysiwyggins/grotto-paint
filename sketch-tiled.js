let _tileMap;
let _tileTextures = [];

let app = new PIXI.Application({
  width: 4096,
  height: 4096,
  backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
app.loader.add(["assets/tiles2x.png"]).load(setup);

function setup() {
  loadMap("assets/maps/exitAction2x.tmj");
}

async function loadMap(url) {
  // var tileTexture = PIXI.utils.TextureCache["assets/tiles2x.png"];
  const response = await fetch(url);
  _tileMap = await response.json();

  for (var i = 0; i < _tileMap.layers[0].data.length; i++) {
    var tileIndex = _tileMap.layers[0].data[i];
    var tileFlipX = tileIndex && (1 << 32);
    var tileFlipY = tileIndex && (1 << 31);
    tileIndex &= 0xFFFF;

    // break out tiled params (bit encoded)
    if(tileIndex) {
      tileIndex -= 1;
      var tileSourceX = parseInt(tileIndex % 10) * _tileMap.tilewidth;
      var tileSourceY = parseInt(tileIndex / 10) * _tileMap.tileheight;
      var canvasX = parseInt(i % _tileMap.width) * _tileMap.tilewidth;
      var canvasY = parseInt(i / _tileMap.width) * _tileMap.tileheight;
      var blitRectangle = new PIXI.Rectangle(
        tileSourceX,
        tileSourceY,
        _tileMap.tilewidth,
        _tileMap.tileheight
      );
      var tileTexture = new PIXI.Texture(app.loader.resources['assets/tiles2x.png'].texture, blitRectangle);
  
      // texture blit area
      var tileSprite = PIXI.Sprite.from(tileTexture);
      tileSprite.position.x = canvasX;
      tileSprite.position.y = canvasY;
      tileSprite.width = _tileMap.tilewidth;
      tileSprite.height = _tileMap.tileheight;
      tileSprite.tint = 0xff0000;
      app.stage.addChild(tileSprite);
  
      console.log(`[${i}] ${tileIndex} ${tileSourceX},${tileSourceY}`)
    }
  }
  // app.width = _tileMap.width * _tileMap.tilewidth;
  // app.height = _tileMap.height * _tileMap.tileheight;
}
