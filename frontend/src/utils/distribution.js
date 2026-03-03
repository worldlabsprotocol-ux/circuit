export async function mockDistribute(trackName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "pending",
        platforms: ["Spotify", "Apple Music"]
      })
    }, 1500)
  })
}
