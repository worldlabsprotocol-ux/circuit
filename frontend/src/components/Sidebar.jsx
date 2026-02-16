import TribeAI from './ai/TribeAI'

export default function Sidebar({ view, setView }) {
  return (
    <div style={wrap}>
      <div className="app-title">WL ATLAS</div>

      <div style={{ flex:1 }} />

      <div style={nav}>
        <Nav label="ATLAS" active={view==='atlas'} onClick={()=>setView('atlas')} />
        <Nav label="ASSETS" active={view==='assets'} onClick={()=>setView('assets')} />
        <Nav label="WHY" active={view==='why'} onClick={()=>setView('why')} />
      </div>

      <div style={tribe}>
        <TribeAI view={view} />
      </div>
    </div>
  )
}

function Nav({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding:'10px 12px',
        borderRadius:8,
        fontSize:12,
        cursor:'pointer',
        opacity: active ? 1 : 0.55,
        background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        transition:'all 160ms ease'
      }}
    >
      {label}
    </div>
  )
}

const wrap = {
  width:260,
  padding:16,
  background:'#0b0f14',
  borderRight:'1px solid rgba(255,255,255,0.06)',
  display:'flex',
  flexDirection:'column',
  height:'100vh'
}

const nav = {
  display:'flex',
  flexDirection:'column',
  gap:6,
  marginBottom:12
}

const tribe = {
  borderTop:'1px solid rgba(255,255,255,0.06)',
  paddingTop:12
}
