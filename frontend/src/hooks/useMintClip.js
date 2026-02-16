/**
 * Frontend mint hook
 *
 * IMPORTANT:
 * - This file must NEVER import Metaplex
 * - Minting is handled by the backend only
 */

export function useMintClip() {
  const mint = async (clip) => {
    const res = await fetch('http://localhost:3001/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clip?.name || 'WL Clip',
        // metadataUri can be added later
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    const data = await res.json()
    console.log('Mint success:', data)
    return data
  }

  return { mint }
}
