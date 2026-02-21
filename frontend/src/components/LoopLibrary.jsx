import React from 'react';
// Placeholder loops - add real URLs or local files
const loops = [
  { name: 'Bass Loop', url: '/sounds/bass-loop.wav' },
  { name: 'Melody Loop', url: '/sounds/melody-loop.wav' },
];

const LoopLibrary = ({ onLoadLoop }) => {
  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-cyan-400">Loop Library</h3>
      <ul>
        {loops.map((loop, i) => (
          <li key={i}>
            <button onClick={() => onLoadLoop(loop.url, i)} className="text-blue-300 hover:underline">{loop.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoopLibrary;
