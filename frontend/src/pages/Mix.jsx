import React, { useState } from 'react';
import { kick, snare, hat } from '../audio/ToneIntegration';

const Mix = () => {
  const [kickVol, setKickVol] = useState(0);
  // Add for others

  const handleVolChange = (instrument, value) => {
    instrument.volume.value = value;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl text-cyan-400">Mix</h2>
      <div>
        <label>Kick Volume</label>
        <input type="range" min="-60" max="0" value={kickVol} onChange={(e) => { setKickVol(e.target.value); handleVolChange(kick, e.target.value); }} />
      </div>
      {/* Add snare, hat */}
    </div>
  );
};

export default Mix;
