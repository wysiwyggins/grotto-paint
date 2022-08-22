// andy reitano / wiley wiggins 2022

// todo:
// - figure out canvas size/width and pass it properly instead of instantiating in constructor
// -

class ScratchBeamEffect {
  constructor() {
    this.enabled = false;
    this.type = 0;
    this.speed = 0;
    this.frequency = 0;
    this.phase = 0;
    this.time = 0;
  }
}

class ScratchBeam {
  // doesn't actually attach to canvas yet, need to figure out size
  constructor(canvas) {
    this.canvas = canvas;

    this.app = new PIXI.Application({
      width: 4096,
      height: 2048,
      backgroundColor: 0xffffff,
    });

    this.tileMap = [];
    this.tileTextures = [];
    this.tileSprites = [];
    this.effect = new ScratchBeamEffect(); // just one effect type to keep things simple
    this.currentLayer = 0;
    document.body.appendChild(this.app.view);
  }

  // https://www.html5gamedevs.com/topic/39373-loader-is-async-right-so-not-sure-how-youd-structure-this/
  loadTextures = async () => {
    return new Promise((resolve, reject) => {
      this.app.loader.add("assets/spritesheets/tiles2x.png").load();

      this.app.loader.onComplete.add(() => {
        resolve();
      });

      this.app.loader.onError.add(() => {
        reject();
      });
    });
  };

  createElement() {}

  getEffects() {
    return this.effects;
  }

  getTileMap() {
    return this.tileMap;
  }

  getTileData(x, y) {
    return this.tileMap.layers[this.currentLayer].data[this.xyToTile(x, y)];
    // return this.tileMap[]
  }

  setTileData(x, y, tile) {
    this.tileMap.layers[this.currentLayer].data[this.xyToTile(x, y)] = tile;
    // return this.tileMap[]
  }
  // push animation from grotto side (can move responsibility however)
  previousFrame() {
    if (this.currentLayer == 0) {
      this.currentLayer = this.tileMap.layers.length - 1;
    } else {
      this.currentLayer--;
    }
  }

  nextFrame() {
    this.currentLayer++;
    this.currentLayer %= this.tileMap.layers.length;
  }

  // takes in hex color
  setTileTint(x, y, color) {
    this.tileSprites[this.xyToTile(x, y)].tint = color;
  }

  renderTiles() {
    for (var i = 0; i < this.tileSprites.length; i++) {
      var tileIndex = this.tileMap.layers[this.currentLayer].data[i];
      var tileFlipX = tileIndex & 0x80000000;
      var tileFlipY = tileIndex & 0x40000000;

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

      if (tileIndex) {
        tileIndex -= 1;
        var tileSourceX = parseInt(tileIndex % 12) * this.tileMap.tilewidth;
        var tileSourceY = parseInt(tileIndex / 12) * this.tileMap.tileheight;
        var blitRectangle = new PIXI.Rectangle(
          tileSourceX,
          tileSourceY,
          this.tileMap.tilewidth,
          this.tileMap.tileheight
        );

        var tileTexture = new PIXI.Texture(
          this.app.loader.resources["assets/spritesheets/tiles2x.png"].texture,
          blitRectangle
        );
        tileTexture.rotate = rotateMode;

        this.tileSprites[i].texture = tileTexture;
      }
    }
  }

  renderEffects() {
    for (var i = 0; i < this.tileSprites.length; i++) {
      var w = 127;
      var c = 128;
      var p = 0;
      // var r = Math.sin(frequency * i + 0 + t) * w + c;
      // var g = Math.sin(frequency * i + 2) * w + c;
      // var b = Math.sin(frequency * i + 4 + t) * w + c;

      var r =
        Math.sin(
          this.effect.frequency * i + 0 + this.effect.phase + this.effect.time
        ) *
          w +
        c;
      var g =
        Math.sin(
          this.effect.frequency * i + 2 + this.effect.phase + this.effect.time
        ) *
          w +
        c;
      var b =
        Math.sin(
          this.effect.frequency * i + 4 + this.effect.phase + this.effect.time
        ) *
          w +
        c;
      var shift =
        Math.sin(
          this.effect.frequency * i + 4 + this.effect.phase + this.effect.time
        ) *
          512 +
        512;

      if (this.effect.type == 0) {
        this.tileSprites[i].tint = this.rgbToColor(0, g, b); // rgb
      } else if (this.effect.type == 1) {
        this.tileSprites[i].x = shift;
      } else if (this.effect.type == 2) {
        var alpha = Math.sin(
          this.effect.frequency * i + this.effect.phase + this.effect.time
        );
        this.tileSprites[i].x = shift;
        this.tileSprites[i].alpha = alpha;
      } else if (this.effect.type == 3) {
        var alpha = Math.sin((this.effect.frequency * i) % 2);
        this.tileSprites[i].x = shift;
        this.tileSprites[i].alpha = alpha;
      }

      // this.tileSprites[i].alpha = r;
    }
  }

  // vsync / rerender all tiles based on map
  render() {
    this.renderTiles();
    if (this.effect.enabled) {
      this.renderEffects();
    }
  }

  // load map .tmj and generate internal tile sprite array
  loadMap(map) {
    this.tileMap = map;
    this.generateTileSprites();
  }

  // having problems fetching inside of a class, just do it at top level and pass object
  async loadMapFile(url) {
    //   loadMap('assets/maps/exitAction2x.tmj');
    // _tileMap = await response.json();
    // console.log(`fetching tilemap from url ${url}`);
    var json = await window
      .fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        return json;
      });
    this.generateTileSprites(json);
  }

  // pre-cache all the tiles we would need for the whole screen and just manipulate those
  // we can now just adjust the texture rectangles to update for high performance and visual effects per tile
  generateTileSprites(json) {
    this.tileMap = json;
    for (var i = 0; i < this.tileSprites; i++) {
      // todo: destroy old sprites
    }

    for (var i = 0; i < this.tileMap.layers[0].data.length; i++) {
      var canvasX = parseInt(i % this.tileMap.width) * this.tileMap.tilewidth;
      var canvasY = parseInt(i / this.tileMap.width) * this.tileMap.tileheight;

      // texture blit area
      var tileTexture = new PIXI.Texture(
        this.app.loader.resources["assets/spritesheets/tiles2x.png"].texture
      );

      var tileSprite = PIXI.Sprite.from(tileTexture);
      tileSprite.position.x = canvasX;
      tileSprite.position.y = canvasY;
      tileSprite.width = this.tileMap.tilewidth;
      tileSprite.height = this.tileMap.tileheight;
      // tileSprite.tint = 0xff0000;

      this.app.stage.addChild(tileSprite);
      this.tileSprites.push(tileSprite);
    }
  }

  // helper that returns the tile index based on current tilemap dimensions, should help clean up code
  xyToTile(x, y) {
    var calc = (x % this.tileMap.width) + (y * this.tileMap.width);
    return calc;
  }

  rgbToColor(r, g, b) {
    return (r << 16) + (g << 8) + b;
  }

}
//wiley's experiments
//was going to try to get a 2darray for some kind of procedural map generation based on drawn maps
/* 
class generateMap {
  constructor(){
    this.tileMap = [];
    this.map2DArray = []
  }

  jsonTo2dArray(json) {
    
    this.currentLayer = 0;
    this.tileMap = json;
    
    var arr = this.tileMap.layers[this.currentLayer].data;
    while(arr.length) this.map2DArray.push(arr.splice(0,this.tileMap.width));
        
    console.log(this.map2DArray);
  }

} */