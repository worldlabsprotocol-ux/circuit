export function crossfade(ctx, fromGain, toGain, duration = 0.2) {
  const now = ctx.currentTime

  fromGain.gain.setValueAtTime(1, now)
  fromGain.gain.linearRampToValueAtTime(0, now + duration)

  toGain.gain.setValueAtTime(0, now)
  toGain.gain.linearRampToValueAtTime(1, now + duration)
}
