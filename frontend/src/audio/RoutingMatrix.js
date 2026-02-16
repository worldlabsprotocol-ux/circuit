export class RoutingMatrix {
  constructor(ctx) {
    this.ctx = ctx

    this.master = ctx.createGain()
    this.drumsBus = ctx.createGain()
    this.musicBus = ctx.createGain()
    this.fxBus = ctx.createGain()

    this.drumsBus.connect(this.master)
    this.musicBus.connect(this.master)
    this.fxBus.connect(this.master)

    this.master.connect(ctx.destination)
  }

  route(node, busName) {
    if (busName === "drums") node.connect(this.drumsBus)
    if (busName === "music") node.connect(this.musicBus)
    if (busName === "fx") node.connect(this.fxBus)
  }
}
