const scratchbeam = new ScratchBeam();

async function setup() {
  await scratchbeam.loadTextures();
  await scratchbeam.loadMapFile('assets/maps/exitAction2x.tmj')
  scratchbeam.render();
}
setup();

scratchbeam.effect.type = 0;
scratchbeam.effect.frequency = 0.3;
scratchbeam.effect.enabled = true;
scratchbeam.render();

// let _rainbowEffect = true;
// function onKeyDown(key) {
//   if (key.keyCode === 65) {
//     // A
//     _frameIndex--;
//     if (_frameIndex < 0) {
//       _frameIndex = _tileMap.layers.length - 1;
//     }
//     renderMap();
//   } else if (key.keyCode === 68) {
//     // D
//     _frameIndex++;
//     if (_frameIndex == _tileMap.layers.length) {
//       _frameIndex = 0;
//     }
//     renderMap();
//   } else if (key.keyCode === 83) {
//     // S
//     _rainbowEffect = !_rainbowEffect;
//   }
// }

// const ticker = new PIXI.Ticker();
// ticker.stop();
// ticker.add((deltaTime) => {
//   if (_rainbowEffect) {
//     rainbowEffect(ticker.lastTime / 1024);
//   }
// });
// ticker.start();
