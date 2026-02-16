export default function RoutingGraph() {
  return (
    <div style={{ marginTop: 40 }}>
      <h3>Routing</h3>
      <div style={{ display: "flex", gap: 20 }}>
        <div>Drums → Bus A → Master</div>
        <div>Piano → Bus B → Master</div>
        <div>Guitar → Bus C → Master</div>
      </div>
    </div>
  )
}
