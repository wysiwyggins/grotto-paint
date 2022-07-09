async function main() {
  let scratchbeam = new ScratchBeam();
  await scratchbeam.loadTextures();

  await window
    .fetch("assets/maps/exitAction2x.tmj")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      scratchbeam.loadMap(json);
    });

  scratchbeam.render();
}
main();
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
