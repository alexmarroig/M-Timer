const test = require('node:test');
const assert = require('node:assert/strict');

const { createAudioEngine } = require('../.tmp-test/services/audioEngine.js');

function createFakeSound() {
  return {
    volumes: [],
    looping: false,
    playCount: 0,
    stopCount: 0,
    unloadCount: 0,
    async setIsLoopingAsync(isLooping) {
      this.looping = isLooping;
    },
    async setVolumeAsync(volume) {
      this.volumes.push(Number(volume.toFixed(2)));
    },
    async playAsync() {
      this.playCount += 1;
    },
    async stopAsync() {
      this.stopCount += 1;
    },
    async unloadAsync() {
      this.unloadCount += 1;
    },
  };
}

test('fadeTo reaches the requested target volume', async () => {
  let sound;
  const engine = createAudioEngine(async () => {
    sound = createFakeSound();
    return sound;
  }, 5);

  await engine.playLoop('ambient', 'fake-source');
  await engine.fadeTo(0.28, 20);

  assert.equal(engine.getCurrentTrack(), 'ambient');
  assert.equal(sound.looping, true);
  assert.equal(sound.playCount, 1);
  assert.ok(Math.abs(sound.volumes.at(-1) - 0.28) < 0.01);
});

test('stopAndUnload clears the active sound and resets the engine', async () => {
  let sound;
  const engine = createAudioEngine(async () => {
    sound = createFakeSound();
    return sound;
  }, 5);

  await engine.playLoop('rain', 'fake-source');
  await engine.fadeTo(0.2, 10);
  await engine.stopAndUnload({ fadeDurationMs: 10 });

  assert.equal(engine.getCurrentTrack(), null);
  assert.equal(engine.getCurrentVolume(), 0);
  assert.equal(sound.stopCount, 1);
  assert.equal(sound.unloadCount, 1);
});
