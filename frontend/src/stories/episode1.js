export const EPISODE_1 = {
  id: 'episode_1',
  title: 'The System That Prints or Decays',
  creator: {
    id: 'creator_001',
    name: 'Atlas Author'
  },
  chapters: {
    intro: {
      text: 'Every system promises something. The question is never what it promises. The question is what it must do to keep that promise.',
      choices: [
        { label: 'Accept the explanation', next: 'offer', cost: 0 },
        { label: 'Ask where the returns come from', next: 'source', cost: 2 }
      ]
    },

    offer: {
      text: 'The system appears calm. Returns arrive steadily. Nothing breaks. Nothing questions itself.',
      choices: [
        { label: 'Focus on growth', next: 'real_assets', cost: 0 },
        { label: 'Trace the risk', next: 'source', cost: 3 }
      ]
    },

    source: {
      text: 'Returns flow from participants who arrive later. Not malicious. Structural.',
      choices: [
        { label: 'Ignore the source', next: 'real_assets', cost: 0 },
        { label: 'Follow the risk path', next: 'leverage', cost: 3 }
      ]
    },

    real_assets: {
      text: 'To stabilize itself, the system anchors to real assets. Property. Contracts. Things beyond the screen.',
      choices: [
        { label: 'Approve the integration', next: 'leverage', cost: 0 },
        { label: 'Examine ownership representation', next: 'ownership', cost: 3 }
      ]
    },

    ownership: {
      text: 'Ownership is symbolic. Claims are layered. Reality sits beneath abstraction.',
      choices: [
        { label: 'Proceed anyway', next: 'leverage', cost: 0 },
        { label: 'Limit exposure', next: 'exit_test', cost: 4 }
      ]
    },

    leverage: {
      text: 'Leverage enters quietly. Returns rise. So does speed.',
      choices: [
        { label: 'Allow leverage', next: 'exit_test', cost: 0 },
        { label: 'Stress test the system', next: 'stress', cost: 4 }
      ]
    },

    stress: {
      text: 'Under pressure, small failures propagate quickly.',
      choices: [
        { label: 'Prepare for exits', next: 'exit_test', cost: 0 }
      ]
    },

    exit_test: {
      text: 'Participants begin to leave. Not all at once. Just enough to matter.',
      choices: [
        { label: 'Honor all exits', next: 'ending_sustainable', cost: 0 },
        { label: 'Throttle withdrawals', next: 'ending_capture', cost: 4 }
      ]
    },

    ending_sustainable: {
      text: 'Returns fall. Trust holds. The system persists.',
      ending: 'SUSTAINABLE_SYSTEM'
    },

    ending_extract: {
      text: 'Early participants leave richer. The structure collapses.',
      ending: 'EXTRACTIVE_MACHINE'
    },

    ending_capture: {
      text: 'Value flows upward. Users exit slowly.',
      ending: 'CAPTURED_STRUCTURE'
    }
  },

  astronaut: {
    name: 'The Observer',
    voice: [
      'Returns do not come from the air.',
      'If you do not know who carries the risk, it is usually you.',
      'Leverage creates speed, not strength.',
      'Trust leaves quietly.'
    ]
  }
}
