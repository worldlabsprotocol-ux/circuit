import Starfield from "../components/Starfield"

export default function About(){
  return(
    <>
      <Starfield/>
      <div style={wrap}>
        <h1 style={title}>ABOUT CIRCUIT</h1>

        <p>
          CIRCUIT is a creator-first production and royalty platform.
        </p>

        <p>
          Create beats. Own your masters. Distribute globally.
          Monetize transparently.
        </p>

        <p>
          Built for producers, composers, and licensing-ready creators.
        </p>
      </div>
    </>
  )
}

const wrap={
  position:"relative",
  zIndex:2,
  padding:60,
  color:"white"
}

const title={
  fontSize:36,
  color:"#00F0FF",
  marginBottom:20
}
