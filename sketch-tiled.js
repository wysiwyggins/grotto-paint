let _tileMap;
let _tileTextures = [];
let _tileSprites = [];
let _frameIndex = 0;

let app = new PIXI.Application({
  width: 4096,
  height: 4096,
  backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
document.addEventListener("keydown", onKeyDown);
app.loader.add(["assets/tiles2x.png"]).load(setup);

function onKeyDown(key) {
  if (key.keyCode === 65) {
    _frameIndex--;
    if (_frameIndex < 0) {
      _frameIndex = _tileMap.layers.length - 1;
    }
    renderMap();
  } else if (key.keyCode === 68) {
    _frameIndex++;
    _frameIndex %= _tileMap.layers.length;
    renderMap();
  } else if (key.keyCode === 83) {
    _frameIndex++;
    _frameIndex %= _tileMap.layers.length;
    randomColor();
  }
}

function setup() {
  loadMap("assets/maps/exitAction2x.tmj");
}

function generateMap() {
  for (var i = 0; i < _tileMap.layers[_frameIndex].data.length; i++) {
    var tileIndex = _tileMap.layers[_frameIndex].data[i];
    var tileFlipX = tileIndex && 1 << 30;
    var tileFlipY = tileIndex && 1 << 31;
    var rotateMode = 0;
    tileIndex &= 0xffff;

    // rotation codes: https://pixijs.download/dev/docs/PIXI.groupD8.html
    if (tileFlipX && tileFlipY) {
      rotateMode = PIXI.groupD8.MAIN_DIAGONAL;
    } else if (tileFlipX) {
      rotateMode = PIXI.groupD8.MIRROR_HORIZONTAL;
    } else if (tileFlipY) {
      rotateMode = PIXI.groupD8.MIRROR_VERTICAL;
    }

    // break out tiled params (bit encoded)
    if (tileIndex) {
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

      var tileTexture = new PIXI.Texture(
        app.loader.resources["assets/tiles2x.png"].texture,
        blitRectangle,
        rotateMode
      );

      // texture blit area
      var tileSprite = PIXI.Sprite.from(tileTexture);
      tileSprite.position.x = canvasX;
      tileSprite.position.y = canvasY;
      tileSprite.width = _tileMap.tilewidth;
      tileSprite.height = _tileMap.tileheight;
      // tileSprite.tint = 0xff0000;
      app.stage.addChild(tileSprite);
      _tileSprites.push(tileSprite);
      console.log(`[${i}] ${tileIndex} ${tileSourceX},${tileSourceY}`);
    }
  }
}
function rgbToColor(r, g, b) {
  return ((r << 24) || (g << 16) || (b));
}

function randomColor() {
  for (var i = 0; i < _tileSprites.length; i++) {
    _tileSprites[i].tint = rgbToColor(127,0,255);
  }
}

function renderMap() {
  for (var i = 0; i < _tileSprites.length; i++) {
    // _tileSprites[i].tint = 0xFF00FF;
  }
}
async function loadMap(url) {
  // var tileTexture = PIXI.utils.TextureCache["assets/tiles2x.png"];
  const response = await fetch(url);
  _tileMap = await response.json();
  generateMap();
}
