export default function Turntable({ pitch, setPitch }){
  return(
    <div style={{marginTop:20,textAlign:"center"}}>
      <div style={{
        width:150,
        height:150,
        borderRadius:"50%",
        background:"radial-gradient(circle,#111 40%,#333 70%,#000 100%)",
        border:"4px solid #00F0FF",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        margin:"0 auto"
      }}>
        🎵
      </div>

      <input
        type="range"
        min="0.5"
        max="2"
        step="0.05"
        value={pitch}
        onChange={e=>setPitch(parseFloat(e.target.value))}
        style={{marginTop:15,width:"100%"}}
      />
    </div>
  )
}
