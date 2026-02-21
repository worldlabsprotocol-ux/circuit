import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Circuit from "./pages/Circuit"
import Royalties from "./pages/Royalties"
import Microphone from "./pages/Microphone"

function BottomNav(){
  const navigate = useNavigate()
  return(
    <div style={navWrap}>
      <button style={navBtn} onClick={()=>navigate("/")}>Home</button>
      <button style={navBtn} onClick={()=>navigate("/create")}>Create</button>
      <button style={navBtn} onClick={()=>navigate("/mic")}>Mic</button>
      <button style={navBtn} onClick={()=>navigate("/royalties")}>Royalties</button>
    </div>
  )
}

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/create" element={<Circuit/>}/>
        <Route path="/mic" element={<Microphone/>}/>
        <Route path="/royalties" element={<Royalties/>}/>
      </Routes>
      <BottomNav/>
    </BrowserRouter>
  )
}

const navWrap={
  position:"fixed",
  bottom:30,
  left:"50%",
  transform:"translateX(-50%)",
  display:"flex",
  gap:30,
  zIndex:10
}

const navBtn={
  padding:"12px 30px",
  borderRadius:40,
  background:"#00F0FF",
  border:"none",
  color:"#000",
  fontWeight:700,
  boxShadow:"0 0 20px #00F0FF",
  cursor:"pointer"
}

// In your router/switch:
case 'Mix': return <Mix />;
