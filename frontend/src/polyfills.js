import { Buffer } from 'buffer'
import process from 'process'

// Node-style globals required by Metaplex and other Web3 libs
if (!window.global) {
  window.global = window
}

if (!window.process) {
  window.process = process
}

if (!window.Buffer) {
  window.Buffer = Buffer
}
