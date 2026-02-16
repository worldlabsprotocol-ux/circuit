import { useState, useEffect } from "react"
import Starfield from "../components/Starfield"
import CircuitTrack from "../components/CircuitTrack"
import TopWallet from "../components/TopWallet"

const instruments = ["Drums","808","Piano","Sax","Lead","Pad","Bass","Keys"]

const drumSamples = {
  kick: "https://cdn.jsdelivr.net/gh/terkelg/beat-machine-sounds/kick.wav",
  snare: "https://cdn.jsdelivr.net/gh/terkelg/beat-machine-sounds/snare.wav",
  hat: "https://cdn.jsdelivr.net/gh/terkelg/beat-machine-sounds/hihat.wav"
}

export default function Circuit(){

  const [activeInstrument,setActiveInstrument]=useState("Drums")
  const [tempo,setTempo]=useState(120)
  const [playing,setPlaying]=useState(false)
  const [step,setStep]=useState(0)
  const [volume,setVolume]=useState(0.9)
  const [rate,setRate]=useState(1)
  const [filter,setFilter]=useState(1)

  const [pattern,setPattern]=useState(
    Array(3).fill(null).map(()=>Array(16).fill(false))
  )

  useEffect(()=>{
    if(!playing)return

    const interval=setInterval(()=>{
      setStep(prev=>{
        const next=(prev+1)%16

        pattern.forEach((row,index)=>{
          if(row[next]){
            const sample=drumSamples[Object.keys(drumSamples)[index]]
            const audio=new Audio(sample)
            audio.volume=volume
            audio.playbackRate=rate
            audio.play()
          }
        })

        return next
      })
    },(60000/tempo)/4)

    return()=>clearInterval(interval)

  },[playing,tempo,pattern,volume,rate])

  function toggleCell(r,c){
    const copy=pattern.map(row=>[...row])
    copy[r][c]=!copy[r][c]
    setPattern(copy)
  }

  return(
    <>
      <Starfield/>
      <TopWallet/>

      <div style={wrap}>
        <CircuitTrack/>

        <h1 style={title}>CIRCUIT</h1>

        <div style={instrumentBar}>
          {instruments.map(inst=>(
            <button
              key={inst}
              onClick={()=>setActiveInstrument(inst)}
              style={{
                ...instrumentBtn,
                background:activeInstrument===inst?"#00F0FF":"#11172B",
                color:activeInstrument===inst?"#000":"#fff"
              }}
            >
              {inst}
            </button>
          ))}
        </div>

        <div style={soundTools}>
          <div>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e=>setVolume(parseFloat(e.target.value))}
            />
          </div>

          <div>
            Playback Rate
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={rate}
              onChange={e=>setRate(parseFloat(e.target.value))}
            />
          </div>

          <div>
            Filter Placeholder
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={filter}
              onChange={e=>setFilter(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div style={transport}>
          <button onClick={()=>setPlaying(!playing)}>
            {playing?"Stop":"Play"}
          </button>

          <input
            type="range"
            min="80"
            max="160"
            value={tempo}
            onChange={e=>setTempo(parseInt(e.target.value))}
          />
        </div>

        {pattern.map((row,r)=>(
          <div key={r} style={rowStyle}>
            <span style={{width:140,fontWeight:600}}>
              Layer {r+1}
            </span>

            <div style={grid}>
              {row.map((active,c)=>(
                <div
                  key={c}
                  onClick={()=>toggleCell(r,c)}
                  style={{
                    ...cellStyle,
                    background:
                      step===c
                        ? "#ffffff"
                        : active
                          ? "#00F0FF"
                          : "#1b1f2b"
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <div style={botSection}>
          <input
            placeholder="CircuitBot coming soon"
            style={botInput}
          />
        </div>

      </div>
    </>
  )
}

const wrap={position:"relative",zIndex:2,padding:60,color:"white"}
const title={fontSize:48,color:"#00F0FF",marginBottom:30}

const instrumentBar={
  display:"flex",
  gap:15,
  flexWrap:"wrap",
  marginBottom:30
}

const instrumentBtn={
  padding:"12px 20px",
  borderRadius:30,
  border:"none",
  fontWeight:600,
  cursor:"pointer"
}

const soundTools={
  display:"flex",
  gap:40,
  marginBottom:30
}

const transport={
  display:"flex",
  gap:25,
  marginBottom:40,
  alignItems:"center"
}

const rowStyle={
  display:"flex",
  alignItems:"center",
  marginBottom:30
}

const grid={
  display:"grid",
  gridTemplateColumns:"repeat(16,1fr)",
  gap:16,
  flex:1
}

const cellStyle={
  height:90,
  borderRadius:16,
  cursor:"pointer"
}

const botSection={
  marginTop:30,
  display:"flex",
  justifyContent:"center"
}

const botInput={
  width:300,
  padding:"12px 20px",
  borderRadius:30,
  border:"none",
  background:"rgba(255,255,255,0.05)",
  color:"white"
}
