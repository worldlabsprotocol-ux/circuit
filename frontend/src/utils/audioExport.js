import { saveAs } from "file-saver"
import lamejs from "lamejs"

export async function exportWav(audioBuffer) {
  const wavBlob = bufferToWave(audioBuffer, audioBuffer.length)
  saveAs(wavBlob, "circuit-export.wav")
}

export async function exportMp3(audioBuffer) {
  const mp3encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128)
  const samples = audioBuffer.getChannelData(0)
  const mp3Data = []

  const blockSize = 1152
  for (let i = 0; i < samples.length; i += blockSize) {
    const chunk = samples.subarray(i, i + blockSize)
    const mp3buf = mp3encoder.encodeBuffer(floatTo16BitPCM(chunk))
    if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf))
  }

  const mp3buf = mp3encoder.flush()
  if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf))

  const blob = new Blob(mp3Data, { type: "audio/mp3" })
  saveAs(blob, "circuit-export.mp3")
}

function floatTo16BitPCM(input) {
  const output = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    output[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff
  }
  return output
}

function bufferToWave(abuffer, len) {
  const numOfChan = abuffer.numberOfChannels
  const length = len * numOfChan * 2 + 44
  const buffer = new ArrayBuffer(length)
  const view = new DataView(buffer)
  let offset = 0
  let pos = 0

  function setUint16(data) {
    view.setUint16(pos, data, true)
    pos += 2
  }

  function setUint32(data) {
    view.setUint32(pos, data, true)
    pos += 4
  }

  setUint32(0x46464952)
  setUint32(length - 8)
  setUint32(0x45564157)

  setUint32(0x20746d66)
  setUint32(16)
  setUint16(1)
  setUint16(numOfChan)
  setUint32(abuffer.sampleRate)
  setUint32(abuffer.sampleRate * 2 * numOfChan)
  setUint16(numOfChan * 2)
  setUint16(16)

  setUint32(0x61746164)
  setUint32(length - pos - 4)

  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    const channel = abuffer.getChannelData(i)
    for (let j = 0; j < channel.length; j++) {
      view.setInt16(pos, channel[j] * 0x7fff, true)
      pos += 2
    }
  }

  return new Blob([buffer], { type: "audio/wav" })
}
