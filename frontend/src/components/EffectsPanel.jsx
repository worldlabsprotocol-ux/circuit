import React, { useState } from 'react';
import { reverb, applyEffect } from '../audio/ToneIntegration'; // Adjust if needed
import { kick, snare, hat } from '../audio/ToneIntegration';

const EffectsPanel = () => {
  const [reverbWet, setReverbWet] = useState(0.5);

  const handleReverbChange = (e) => {
    const value = parseFloat(e.target.value);
    setReverbWet(value);
    reverb.wet.value = value;
    // Apply to all instruments (or make selectable)
    applyEffect(kick, reverb);
    applyEffect(snare, reverb);
    applyEffect(hat, reverb);
  };

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-cyan-400">Effects</h3>
      <label className="block">Reverb: {reverbWet}</label>
      <input type="range" min="0" max="1" step="0.01" value={reverbWet} onChange={handleReverbChange} className="w-full" />
      {/* Add more effects like delay here */}
    </div>
  );
};

export default EffectsPanel;
