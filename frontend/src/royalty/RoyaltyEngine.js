export class RoyaltyEngine {
  constructor() {
    this.tracks = JSON.parse(localStorage.getItem("circuit-royalty")) || []
  }

  persist() {
    localStorage.setItem("circuit-royalty", JSON.stringify(this.tracks))
  }

  createTrack(name) {
    const track = {
      id: Date.now(),
      name,
      splits: [],
      revenueLedger: [],
      payouts: [],
      locked: false,
      advanceTaken: 0
    }
    this.tracks.push(track)
    this.persist()
    return track
  }

  addSplit(trackId, role, percent) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track || track.locked) return
    track.splits.push({ role, percent })
    this.persist()
  }

  validateSplits(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return false
    const total = track.splits.reduce((sum, s) => sum + s.percent, 0)
    return total === 100
  }

  lockSplits(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return false
    if (!this.validateSplits(trackId)) return false
    track.locked = true
    this.persist()
    return true
  }

  addRevenue(trackId, platform, amount) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return
    track.revenueLedger.push({
      platform,
      amount,
      timestamp: Date.now()
    })
    this.persist()
  }

  getTotalRevenue(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return 0
    return track.revenueLedger.reduce((sum, r) => sum + r.amount, 0)
  }

  calculatePayouts(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return []

    const totalRevenue = this.getTotalRevenue(trackId)

    track.payouts = track.splits.map(split => ({
      role: split.role,
      amount: (totalRevenue * split.percent) / 100
    }))

    this.persist()
    return track.payouts
  }

  requestAdvance(trackId, multiplier = 2) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return 0
    const revenue = this.getTotalRevenue(trackId)
    const advance = revenue * multiplier
    track.advanceTaken += advance
    this.persist()
    return advance
  }

  exportStatement(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return null

    return {
      track: track.name,
      totalRevenue: this.getTotalRevenue(trackId),
      splits: track.splits,
      payouts: track.payouts,
      ledger: track.revenueLedger
    }
  }

  generateOwnershipHash(trackId) {
    const track = this.tracks.find(t => t.id === trackId)
    if (!track) return null
    const data = JSON.stringify(track)
    return btoa(data).slice(0, 32)
  }
}
