import * as Tone from 'tone'

let initialized = false

export async function initEngine() {
if (initialized) return
await Tone.start()
initialized = true
}

export const transport = Tone.Transport
