export type EmotionalRegister =
  | 'awe'              // The universe is bigger/stranger than I thought
  | 'surprise'         // I had no idea
  | 'delight'          // This is fun / clever / funny
  | 'inspiration'      // Someone did something I want to do
  | 'education'        // I understand something I didn't before
  | 'warmth'           // This is tender / human / connecting
  | 'earned-discomfort'; // Uncomfortable but worth knowing

export const REGISTER_RULES = `
EMOTIONAL TARGET:
Every Spark must land in one of these seven registers:
- awe: when the scale, age, or strangeness is the point
- surprise: when the twist is the point
- delight: when the joy is the point — comedy, wit, beauty
- inspiration: when a human did something extraordinary — focus on the doing, not the praise
- education: when the user genuinely now knows something they didn't
- warmth: when the topic touches something tender about being alive
- earned-discomfort: when the truth is uncomfortable but the user thanks you for the honesty

FORBIDDEN:
Do not produce a Spark that primarily generates outrage, doom, anxiety, or shame.
If a trend can only deliver outrage or doom, return: { "skip": true, "reason": "..." }
The feed should make users feel more alive, not more depleted.
`.trim();

export const FORBIDDEN_KEYWORDS = [
  'outrage', 'slammed', 'destroyed', 'crisis', 'disaster', 'worst ever', "you won't believe",
];
