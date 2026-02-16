export const capabilities = {
  solanaPay: {
    enabled: true,
    tokens: ['SOL', 'DYAD'],
    qr: true,
  },

  nftMint: {
    enabled: true,
    viaQR: true,
  },

  staking: {
    enabled: false,
    token: 'SKR',
    vipAccess: true,
    yield: true,
  },
}
