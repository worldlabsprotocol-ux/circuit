export function createFXChain(ctx) {
  const input = ctx.createGain()
  const reverb = ctx.createConvolver()
  const delay = ctx.createDelay()
  const output = ctx.createGain()

  delay.delayTime.value = 0.2
  output.gain.value = 1

  input.connect(delay)
  delay.connect(output)

  return {
    input,
    output,
    setDelay(value) {
      delay.delayTime.value = value
    }
  }
}
