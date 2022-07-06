let _tileMap;
let _tileTextures = [];
let _tileSprites = [];
let _frameIndex = 0;
let _rainbowEffect = false;

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
    // A
    _frameIndex--;
    if (_frameIndex < 0) {
      _frameIndex = _tileMap.layers.length - 1;
    }
    renderMap();
  } else if (key.keyCode === 68) {
    // D
    _frameIndex++;
    if (_frameIndex == _tileMap.layers.length) {
      _frameIndex = 0;
    }
    renderMap();
  } else if (key.keyCode === 83) {
    // S
    _rainbowEffect = !_rainbowEffect;
  }
}

function setup() {
  loadMap("assets/maps/exitAction2x.tmj");
}

function generateMap() {
  for (var i = 0; i < _tileMap.layers[_frameIndex].data.length; i++) {
    var canvasX = parseInt(i % _tileMap.width) * _tileMap.tilewidth;
    var canvasY = parseInt(i / _tileMap.width) * _tileMap.tileheight;

    // texture blit area
    var tileTexture = new PIXI.Texture(
      app.loader.resources["assets/tiles2x.png"].texture
    );

    var tileSprite = PIXI.Sprite.from(tileTexture);
    tileSprite.position.x = canvasX;
    tileSprite.position.y = canvasY;
    tileSprite.width = _tileMap.tilewidth;
    tileSprite.height = _tileMap.tileheight;
    // tileSprite.tint = 0xff0000;
    app.stage.addChild(tileSprite);
    _tileSprites.push(tileSprite);
  }

  renderMap();
}

function renderMap() {
  for (var i = 0; i < _tileSprites.length; i++) {
    var tileIndex = _tileMap.layers[_frameIndex].data[i];
    var tileFlipX = tileIndex & ~(1 << 30);
    var tileFlipY = tileIndex & ~(1 << 31);
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
      _tileSprites[i].texture = tileTexture;

      // console.log(`[${i}] ${tileIndex} ${tileSourceX},${tileSourceY}`);
    }
  }
}

function rgbToColor(r, g, b) {
  return (r << 16) + (g << 8) + b;
}

function rainbowEffect(t) {
  var frequency = 0.7;
  for (var i = 0; i < _tileSprites.length; i++) {
    var w = 127;
    var c = 128;
    var p = 0;
    // var r = Math.sin(frequency * i + 0 + t) * w + c;
    // var g = Math.sin(frequency * i + 2) * w + c;
    // var b = Math.sin(frequency * i + 4 + t) * w + c;

    var r = Math.sin(frequency * i + 0 + p + t) * w + c;
    var g = Math.sin(frequency * i + 2 + p + t) * w + c;
    var b = Math.sin(frequency * i + 4 + p + t) * w + c;

    _tileSprites[i].tint = rgbToColor(0, g, b);
  }
}

async function loadMap(url) {
  // var tileTexture = PIXI.utils.TextureCache["assets/tiles2x.png"];
  const response = await fetch(url);
  _tileMap = await response.json();
  generateMap();
}

const ticker = new PIXI.Ticker();
ticker.stop();
ticker.add((deltaTime) => {
  if (_rainbowEffect) {
    rainbowEffect(ticker.lastTime / 1024);
  }
});
ticker.start();
