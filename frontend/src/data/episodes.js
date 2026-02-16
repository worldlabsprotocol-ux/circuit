export const EPISODES = [
  {
    id: 'episode-1',
    title: 'Proximity Beats Size',
    creator: 'atlas_author',
    lens: 'accessibility',
    chapters: [
      {
        text: 'You observe that reachable systems outperform distant giants.',
        choices: [
          { label: 'Focus on reachability', next: 1 },
          { label: 'Ignore proximity', next: 2 }
        ]
      },
      {
        text: 'Systems nearby compound faster. You gain momentum.',
        ending: 'accessibility_win'
      },
      {
        text: 'Distance slows progress. Opportunity decays.',
        ending: 'accessibility_loss'
      }
    ]
  }
]
