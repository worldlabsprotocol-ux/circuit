import React, { useState } from 'react';
import * as Tone from 'tone';
import { kick, snare, hat, reverb } from '../audio/ToneIntegration';

const EffectsPanel = () => {
  const [reverbWet, setReverbWet] = useState(reverb.wet.value || 0.3);
  const [delayWet, setDelayWet] = useState(0);

  const handleReverb = (e) => {
    const val = parseFloat(e.target.value);
    setReverbWet(val);
    reverb.wet.value = val;
    // Chain to drums (expand later for layers)
    kick.connect(reverb);
    snare.connect(reverb);
    hat.connect(reverb);
  };

  const handleDelay = (e) => {
    const val = parseFloat(e.target.value);
    setDelayWet(val);
    const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
    delay.wet.value = val;
    kick.connect(delay);
    snare.connect(delay);
    hat.connect(delay);
  };

  return (
    <div className="mt-6 p-4 bg-gray-900/70 rounded-xl border border-cyan-500/30">
      <h3 className="text-lg font-bold text-cyan-400 mb-3">Effects Chain</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Reverb Wet ({(reverbWet * 100).toFixed(0)}%)</label>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={reverbWet} 
            onChange={handleReverb} 
            className="w-full accent-cyan-500" 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Delay Wet ({(delayWet * 100).toFixed(0)}%)</label>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={delayWet} 
            onChange={handleDelay} 
            className="w-full accent-cyan-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsPanel;
