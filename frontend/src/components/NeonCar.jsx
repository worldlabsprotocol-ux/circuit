export default function NeonCar(){
  return(
    <div style={{
      position:"absolute",
      top:120,
      left:0,
      width:"100%",
      height:3,
      background:"linear-gradient(90deg, transparent, #00F0FF, transparent)",
      animation:"drive 5s linear infinite"
    }}/>
  )
}
