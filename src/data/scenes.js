// ────────────────────────────────────────────────────────────────────────────
// Playable scenes. The Play screen (/play/:bookId/:sceneId) is a GENERIC beat
// player — everything it shows comes from this file. See README → "Authoring
// a scene" for the beat format, poses, props, camera targets and lighting.
//
// Beat types:
//   narration  { text, stage? }
//   npc_line   { speaker, text, mood?, stage? }
//   user_turn  { intent, suggestedLine, simulated: { transcript, scores,
//                npcReaction, mood, isBigMoment? }, stage? }
//
// stage (optional — directs the shadow-theatre stage at beat start; all fields
// optional, omitted fields keep current state, unknown names no-op):
//   camera:    'wide' | 'holmes' | 'you' | 'constable' |
//              'window' | 'wallWriting' | 'lamp' | 'door'
//   highlight: 'window' | 'wallWriting' | 'lamp' | 'door'   (2s pulse)
//   lighting:  'calm' | 'tense' | 'revelation'
//   poses:     { holmes: 'speaking', you: { pose: 'pointing', target: 'right' } }
//              poses: idle · speaking · pointing(+target) · impressed · puzzled
//   enter / exit: character id walks on / off stage ('constable')
//
// Auto-direction (no data needed): npc speakers pose 'speaking'; during the
// user's turn the camera drifts to 'you'; feedback re-poses the NPC from the
// simulated mood; big moments switch lighting to 'revelation'.
//
// Scores use the app's skill keys (relevance · smoothness · clarity · grammar).
// All text is ORIGINAL — evocative of the book's premise, never quoting it.
// ────────────────────────────────────────────────────────────────────────────

export const scenes = [
  {
    id: 'sc5',
    bookId: 'scarlet',
    sceneNumber: 5,
    title: 'The Cabman’s Tale',
    setId: 'lauriston-room',
    npc: { name: 'Holmes' },
    beats: [
      {
        type: 'narration',
        text: 'Night has fallen over Lauriston Gardens when Holmes leads you back into the empty house. The word on the wall waits in the dark.',
        stage: { camera: 'wide', lighting: 'calm' },
      },
      {
        type: 'npc_line',
        speaker: 'Holmes',
        text: 'The daylight showed us what the killer wanted seen. The dark will show us what he hoped to hide.',
        stage: {
          camera: 'wallWriting',
          highlight: 'wallWriting',
          poses: { holmes: { pose: 'pointing', target: 'left' } },
        },
      },
      {
        type: 'user_turn',
        intent: 'Tell Holmes what you noticed about the room earlier',
        suggestedLine: 'The window was forced from the inside, Holmes.',
        simulated: {
          transcript: 'I think the window was forced from the inside, Holmes.',
          scores: { relevance: 78, smoothness: 72, clarity: 75, grammar: 81 },
          npcReaction: 'Holmes nods slowly.',
          mood: 'neutral',
        },
      },
      {
        type: 'npc_line',
        speaker: 'Holmes',
        text: 'From the inside. Curious, is it not — a house locked in fear, yet opened from within.',
        stage: {
          camera: 'window',
          highlight: 'window',
          poses: { holmes: { pose: 'pointing', target: 'right' } },
        },
      },
      {
        type: 'narration',
        text: 'Holmes crosses to the cold hearth and runs one gloved finger through the ash.',
        stage: { camera: 'wide', poses: { holmes: 'idle' } },
      },
      {
        type: 'user_turn',
        intent: 'Ask Holmes what he has found in the ash',
        suggestedLine: 'Is there something in the ashes, Holmes?',
        simulated: {
          transcript: 'Is there… something… in the ash, Holmes?',
          scores: { relevance: 70, smoothness: 58, clarity: 66, grammar: 74 },
          npcReaction: 'Holmes glances up, puzzled by your hesitation.',
          mood: 'puzzled',
        },
        stage: { lighting: 'tense' }, // the shaky moment dims and cools
      },
      {
        type: 'npc_line',
        speaker: 'Holmes',
        text: 'Ash from a cigar no London shop sells. Our man brought his habits from somewhere far away.',
        stage: { lighting: 'calm', camera: 'holmes', poses: { holmes: 'speaking' } },
      },
      {
        type: 'npc_line',
        speaker: 'Constable',
        text: 'Begging your pardon, sirs — there was a cab stood waiting out front that night, near midnight.',
        stage: { enter: 'constable', camera: 'door', poses: { constable: 'speaking', holmes: 'idle' } },
      },
      {
        type: 'narration',
        text: 'The constable touches his helmet and returns to his post by the gate.',
        stage: { exit: 'constable', camera: 'wide' },
      },
      {
        type: 'user_turn',
        intent: 'Confirm it — tell Holmes what you saw by the curb',
        suggestedLine: 'There were two wheel ruts by the curb — a cab stood waiting here.',
        simulated: {
          transcript: 'There were two wheel ruts by the curb — a cab stood waiting here.',
          scores: { relevance: 84, smoothness: 79, clarity: 82, grammar: 86 },
          npcReaction: 'Holmes’s whole posture brightens.',
          mood: 'impressed',
        },
      },
      {
        type: 'npc_line',
        speaker: 'Holmes',
        text: 'Precisely. The killer did not walk to this house — he was driven to it, and he was not alone.',
        stage: { camera: 'holmes', poses: { holmes: 'speaking' } },
      },
      {
        type: 'narration',
        text: 'Holmes turns to you, the gaslight catching the edge of a rare smile.',
        stage: { poses: { holmes: 'impressed' } },
      },
      {
        type: 'user_turn',
        intent: 'Put it together — tell Holmes who you should be looking for',
        suggestedLine: 'Then we’re not looking for a passenger, Holmes — we’re looking for the cabman.',
        simulated: {
          transcript: 'Then we’re not looking for a passenger, Holmes — we’re looking for the cabman himself.',
          scores: { relevance: 95, smoothness: 88, clarity: 91, grammar: 93 },
          npcReaction: 'Holmes laughs — actually laughs — and claps you on the shoulder.',
          mood: 'impressed',
          isBigMoment: true, // → 'revelation' lighting handles the celebration
        },
      },
      {
        type: 'npc_line',
        speaker: 'Holmes',
        text: 'There are days, my friend, when you astonish me. Tomorrow, we hunt a cabman.',
        stage: { lighting: 'revelation', camera: 'holmes', poses: { holmes: 'impressed' } },
      },
      {
        type: 'narration',
        text: 'The fog folds itself over the empty house behind you, and the night swallows the street whole.',
        stage: { lighting: 'calm', camera: 'wide', poses: { holmes: 'idle', you: 'idle' } },
      },
    ],
  },
]

// The Play route uses this; Book screens use it to decide play vs toast.
export const getPlayableScene = (bookId, sceneId) =>
  scenes.find((s) => s.bookId === bookId && s.id === sceneId) ?? null
