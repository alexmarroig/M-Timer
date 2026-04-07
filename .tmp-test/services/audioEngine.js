"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudioEngine = createAudioEngine;
async function defaultCreateSound(source) {
    const { createAudioPlayer } = await Promise.resolve().then(() => __importStar(require('expo-audio')));
    const player = createAudioPlayer(source, {
        keepAudioSessionActive: true,
    });
    player.loop = true;
    player.volume = 0;
    return {
        async setIsLoopingAsync(isLooping) {
            player.loop = isLooping;
        },
        async setVolumeAsync(volume) {
            player.volume = volume;
        },
        async playAsync() {
            player.play();
        },
        async stopAsync() {
            player.pause();
            await player.seekTo(0);
        },
        async unloadAsync() {
            player.pause();
            await player.seekTo(0);
            player.remove();
        },
    };
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function createAudioEngine(createSound = defaultCreateSound, fadeStepMs = 80) {
    let sound = null;
    let currentTrack = null;
    let currentVolume = 0;
    let fadeInterval = null;
    const clearFade = () => {
        if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
    };
    const load = async (track, source) => {
        if (sound && currentTrack === track) {
            return;
        }
        if (sound) {
            await sound.stopAsync().catch(() => { });
            await sound.unloadAsync().catch(() => { });
        }
        sound = await createSound(source);
        currentTrack = track;
        currentVolume = 0;
        await sound.setIsLoopingAsync(true);
        await sound.setVolumeAsync(0);
    };
    const playLoop = async (track, source) => {
        await load(track, source);
        if (!sound) {
            return;
        }
        await sound.playAsync().catch(() => { });
    };
    const fadeTo = async (targetVolume, durationMs) => {
        const nextTarget = clamp(targetVolume, 0, 1);
        if (!sound) {
            currentVolume = nextTarget;
            return;
        }
        clearFade();
        if (durationMs <= 0) {
            currentVolume = nextTarget;
            await sound.setVolumeAsync(currentVolume).catch(() => { });
            return;
        }
        const activeSound = sound;
        const startVolume = currentVolume;
        const totalSteps = Math.max(1, Math.round(durationMs / fadeStepMs));
        await new Promise((resolve) => {
            let step = 0;
            fadeInterval = setInterval(() => {
                step += 1;
                const progress = step / totalSteps;
                currentVolume = startVolume + (nextTarget - startVolume) * progress;
                void activeSound.setVolumeAsync(currentVolume).catch(() => { });
                if (step >= totalSteps) {
                    clearFade();
                    resolve();
                }
            }, fadeStepMs);
        });
    };
    const stopAndUnload = async ({ fadeDurationMs = 0 } = {}) => {
        const activeSound = sound;
        if (!activeSound) {
            currentTrack = null;
            currentVolume = 0;
            return;
        }
        if (fadeDurationMs > 0) {
            await fadeTo(0, fadeDurationMs);
        }
        else {
            clearFade();
            currentVolume = 0;
            await activeSound.setVolumeAsync(0).catch(() => { });
        }
        clearFade();
        await activeSound.stopAsync().catch(() => { });
        await activeSound.unloadAsync().catch(() => { });
        if (sound === activeSound) {
            sound = null;
            currentTrack = null;
            currentVolume = 0;
        }
    };
    return {
        load,
        playLoop,
        fadeTo,
        stopAndUnload,
        getCurrentTrack: () => currentTrack,
        getCurrentVolume: () => currentVolume,
    };
}
