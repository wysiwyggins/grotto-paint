const scratchbeam = new ScratchBeam();

async function setup() {
  await scratchbeam.loadTextures();
  await scratchbeam.loadMapFile("assets/maps/exitAction2x.tmj");
  scratchbeam.render();
}
setup();

scratchbeam.effect.type = 0;
scratchbeam.effect.frequency = 0.3;
scratchbeam.effect.enabled = true;

// can use requestanimationframe here instead if we want
const ticker = new PIXI.Ticker();
ticker.stop();
ticker.add((deltaTime) => {
  scratchbeam.effect.time = ticker.lastTime / 2048;
  scratchbeam.render(); // vblank
});
ticker.start();

function onKeyDown(key) {
  if (key.keyCode === 65) {
    scratchbeam.previousFrame(); // a
  } else if (key.keyCode === 68) {
    scratchbeam.nextFrame(); // d
  } else if (key.keyCode === 87) {
    scratchbeam.effect.frequency += 0.1; // w
  } else if (key.keyCode === 83) {
    scratchbeam.effect.frequency += -0.1; // s
  } else if (key.keyCode === 81) {
    scratchbeam.effect.enabled != scratchbeam.effect.enabled; // q
  }
}

addEventListener("keydown", onKeyDown);
