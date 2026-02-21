import * as Tone from 'tone';

let audioUnlocked = false;

export async function unlockAudio() {
  if (!audioUnlocked) {
    await Tone.start();
    audioUnlocked = true;
    console.log('Audio context unlocked');
  }
}

// Synth definitions...
export const kick = new Tone.MembraneSynth({
  pitchDecay: 0.01,
  octaves: 6,
  oscillator: { type: 'sine' },
  envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
}).toDestination();

export const snare = new Tone.NoiseSynth({
  noise: { type: 'white' },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
}).toDestination();

export const hat = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.1, release: 0.1 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
}).toDestination();

export const reverb = new Tone.Reverb({ wet: 0.5 });

export function createSequencer(patterns, onStep) {
  const seq = new Tone.Sequence((time, step) => {
    Object.keys(patterns).forEach(instrument => {
      if (patterns[instrument][step]) {
        switch (instrument) {
          case 'kick': kick.triggerAttackRelease('C2', '8n', time); break;
          case 'snare': snare.triggerAttackRelease('8n', time); break;
          case 'hat': hat.triggerAttackRelease('8n', time); break;
        }
        onStep(step);
      }
    });
  }, Array.from({ length: 16 }, (_, i) => i), '16n');

  Tone.Transport.bpm.value = 120;
  return seq;
}

export function applyEffect(instrument, effect) {
  instrument.chain(effect, Tone.Destination);
}
