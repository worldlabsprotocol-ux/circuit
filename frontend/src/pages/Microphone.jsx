import { useState, useRef } from "react"
import Starfield from "../components/Starfield"

export default function Microphone(){
  const [recording,setRecording]=useState(false)
  const [audioURL,setAudioURL]=useState(null)
  const mediaRecorderRef=useRef(null)
  const chunksRef=useRef([])

  async function startRecording(){
    const stream=await navigator.mediaDevices.getUserMedia({audio:true})
    const recorder=new MediaRecorder(stream)
    mediaRecorderRef.current=recorder

    recorder.ondataavailable=e=>{
      chunksRef.current.push(e.data)
    }

    recorder.onstop=()=>{
      const blob=new Blob(chunksRef.current,{type:"audio/webm"})
      setAudioURL(URL.createObjectURL(blob))
      chunksRef.current=[]
    }

    recorder.start()
    setRecording(true)
  }

  function stopRecording(){
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  function exportRecording(){
    if(!audioURL)return
    const a=document.createElement("a")
    a.href=audioURL
    a.download="circuit-recording.webm"
    a.click()
  }

  return(
    <>
      <Starfield/>

      <div style={wrap}>
        <h1 style={{color:"#00F0FF"}}>Studio Microphone</h1>

        <div style={mic}>🎙</div>

        <button
          style={btn}
          onClick={recording?stopRecording:startRecording}
        >
          {recording?"Stop Recording":"Start Recording"}
        </button>

        {audioURL && (
          <>
            <audio controls src={audioURL} style={{marginTop:20}}/>
            <button style={btn} onClick={exportRecording}>
              Save Recording
            </button>
          </>
        )}
      </div>
    </>
  )
}

const wrap={
  position:"relative",
  zIndex:2,
  padding:60,
  color:"white",
  textAlign:"center"
}

const mic={
  fontSize:140,
  marginTop:60
}

const btn={
  marginTop:20,
  padding:"14px 30px",
  borderRadius:40,
  background:"#00F0FF",
  border:"none",
  color:"#000",
  fontWeight:700
}
