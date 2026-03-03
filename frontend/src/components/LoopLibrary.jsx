import React from 'react';

const loops = [
  { name: 'Deep Bass Loop', category: 'Bass' },
  { name: 'Atmospheric Pad', category: 'Synth' },
  { name: 'Trap Hi-Hat Roll', category: 'Drums' },
];

const LoopLibrary = ({ onSelect }) => {
  return (
    <div className="mt-6 p-4 bg-gray-900/70 rounded-xl border border-cyan-500/30">
      <h3 className="text-lg font-bold text-cyan-400 mb-3">Loop Library (Inspired by BandLab/GarageBand)</h3>
      <div className="grid grid-cols-2 gap-3">
        {loops.map((loop, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(loop.name)}
            className="bg-cyan-900/50 hover:bg-cyan-700/70 p-3 rounded-lg text-left transition"
          >
            <span className="font-medium">{loop.name}</span>
            <p className="text-xs text-gray-400">{loop.category}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">Select to load into a layer (console log for now)</p>
    </div>
  );
};

export default LoopLibrary;
