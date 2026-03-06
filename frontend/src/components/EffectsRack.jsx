import React from "react";

export default function EffectsRack(props) {

  const section = {
  border: "1px solid rgba(0,255,255,0.2)",
  borderRadius: 10,
  padding: 10,
  marginBottom: 8,
  background: "rgba(0,255,255,0.05)"
};

  const label = {
  fontSize: 12,
  marginBottom: 4,
  display: "flex",
  justifyContent: "space-between"
};

 const slider = {
  width: "100%",
  marginTop: 4,
  height: 4,
  cursor: "pointer"
};

 return (
  <div style={{ padding: 12 }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      }}
    >
      {/* REVERB */}
      <div style={section}>
        <div style={label}>
          <span>Reverb</span>
          <span>{Math.round(props.reverbWet * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.reverbWet}
          onChange={e => props.setReverbWet(parseFloat(e.target.value))}
          style={slider}
        />
      </div>

      {/* DELAY */}
      <div style={section}>
        <div style={label}>
          <span>Delay</span>
          <span>{Math.round(props.delayWet * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.delayWet}
          onChange={e => props.setDelayWet(parseFloat(e.target.value))}
          style={slider}
        />
      </div>

      {/* EQ */}
      <div style={section}>
        <div style={{ marginBottom: 8 }}>EQ</div>

        <div style={label}><span>Low</span><span>{props.eqLow}</span></div>
        <input
          type="range"
          min="-12"
          max="12"
          value={props.eqLow}
          onChange={e => props.setEqLow(parseInt(e.target.value))}
          style={slider}
        />

        <div style={label}><span>Mid</span><span>{props.eqMid}</span></div>
        <input
          type="range"
          min="-12"
          max="12"
          value={props.eqMid}
          onChange={e => props.setEqMid(parseInt(e.target.value))}
          style={slider}
        />

        <div style={label}><span>High</span><span>{props.eqHigh}</span></div>
        <input
          type="range"
          min="-12"
          max="12"
          value={props.eqHigh}
          onChange={e => props.setEqHigh(parseInt(e.target.value))}
          style={slider}
        />
      </div>

      {/* COMPRESSOR */}
      <div style={section}>
        <div style={label}>
          <span>Compressor</span>
          <span>{Math.round(props.compressAmount * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.compressAmount}
          onChange={e => props.setCompressAmount(parseFloat(e.target.value))}
          style={slider}
        />
      </div>

      {/* FILTER */}
      <div style={section}>
        <div style={label}>
          <span>Filter</span>
          <span>{props.filterCutoff} Hz</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          value={props.filterCutoff}
          onChange={e => props.setFilterCutoff(parseInt(e.target.value))}
          style={slider}
        />
      </div>

      {/* DISTORTION */}
      <div style={section}>
        <div style={label}>
          <span>Distortion</span>
          <span>{Math.round(props.distortionAmount * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.distortionAmount}
          onChange={e => props.setDistortionAmount(parseFloat(e.target.value))}
          style={slider}
        />
      </div>

      {/* MASTER GAIN */}
      <div style={{ ...section, gridColumn: "span 2" }}>
        <div style={label}>
          <span>Master Gain</span>
          <span>{Math.round(props.masterGain * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.masterGain}
          onChange={e => props.setMasterGain(parseFloat(e.target.value))}
          style={slider}
        />
      </div>
    </div>
  </div>
);
}