const ASTERANK_URL =
  'https://www.asterank.com/api/asterank?query={"dv":{"$gt":1e9}}&limit=50'

class SpatialAssetService {
  async fetchAssetsForWorld(worldPubkey) {
    const res = await fetch(ASTERANK_URL)
    const data = await res.json()

    return data.map((a, index) => ({
      id: a.id || `${a.full_name}-${index}`,
      name: a.full_name,
      profit: a.profit,
      mass: a.mass,
      score: Math.round(a.profit / 1e9),
      world: worldPubkey,
    }))
  }
}

export default new SpatialAssetService()
