const scratchbeam = new ScratchBeam();

async function setup() {
  await scratchbeam.loadTextures();
  await scratchbeam.loadMapFile("assets/maps/exitAction2x.tmj");

  // can use requestanimationframe here instead if we want
  const ticker = new PIXI.Ticker();
  ticker.stop();
  ticker.add(() => {
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
      scratchbeam.effect.frequency += 0.02; // w
    } else if (key.keyCode === 83) {
      scratchbeam.effect.frequency += -0.02; // s
    } else if (key.keyCode === 81) {
      scratchbeam.effect.enabled != scratchbeam.effect.enabled; // q
    }
  }
  addEventListener("keydown", onKeyDown);
}
setup();

scratchbeam.effect.type = 0;
scratchbeam.effect.frequency = 0.62;  // interleave
// scratchbeam.effect.frequency = 0.02;  // very a2600
// scratchbeam.effect.frequency = 4.2;  // interleave like genesis visual work
scratchbeam.effect.enabled = true;

// scratchbeam.getTileData(0);
// scratchbeam.setTileTint(24,24,0x0000FF);

// scratchbeam.nextFrame();
// scratchbeam.previousFrame();
