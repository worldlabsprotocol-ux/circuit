export default function AssetsView() {
  return (
    <div style={{ padding:32, maxWidth:760, lineHeight:1.65, color:'#fff' }}>
      <h3>Assets</h3>

      <p>
        In WL ATLAS, an asset is not just a balance or a token. It is a structured
        representation of something you understand, control, or produce.
      </p>

      <p>
        Assets begin as ordinary objects. Over time, they can be formalized into
        transferable units that other systems can recognize.
      </p>

      <p>
        This process is designed to be quiet and optional. You do not need prior
        experience with blockchains, wallets, or decentralized finance to begin.
      </p>

      <h4>Tokenization</h4>

      <p>
        Tokenization is the act of giving an asset a standardized form so it can
        move between systems without friction. Ownership and permissions become
        explicit only when needed.
      </p>

      <h4>SKR</h4>

      <p>
        SKR acts as a coordination layer inside WL ATLAS. It aligns access and
        participation without requiring constant interaction.
      </p>

      <div style={{
        marginTop:24,
        padding:16,
        background:'rgba(255,255,255,0.04)',
        borderRadius:8,
        fontSize:13,
        opacity:0.8
      }}>
        Asset creation and formalization will appear when relevant.
      </div>
    </div>
  )
}
