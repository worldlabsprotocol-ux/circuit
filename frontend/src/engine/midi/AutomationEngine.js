export class AutomationEngine {
  applyAutomation(clip, audioParam, context, tempo) {
    const beatsToSeconds = beats => (60 / tempo) * beats

    clip.automation.forEach(lane => {
      lane.points.forEach(point => {
        const time =
          context.currentTime +
          beatsToSeconds(point.time)

        audioParam.linearRampToValueAtTime(point.value, time)
      })
    })
  }
}
