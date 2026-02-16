export const STORIES = [
  {
    id: 'story_001',
    title: 'Proximity Beats Size',
    creatorId: 'creator_001',
    curated: true,
    chapters: [
      {
        id: 'c1',
        text: 'Nearby systems quietly outperform distant giants.',
        choices: [
          { label: 'Continue', cost: 0, next: 'c2' },
          { label: 'Explore deeper', cost: 3, next: 'c3' }
        ]
      },
      {
        id: 'c2',
        text: 'You finish the surface path.',
        ending: 'neutral'
      },
      {
        id: 'c3',
        text: 'You uncover structural advantages only proximity enables.',
        ending: 'premium'
      }
    ]
  }
]
