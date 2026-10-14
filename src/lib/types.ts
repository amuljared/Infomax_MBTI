export type Dimension = "EI" | "SN" | "TF" | "JP";
export type Choice = "A" | "B";

export interface MbtiType {
  code: string;
  nickname: string;
  description: string;
  blurb: string;
}

export interface LetterInfo {
  name: string;
  meaning: string;
}

export interface DimensionInfo {
  title: string;
  subtitle: string;
  first: string; // letter that option A maps to
  second: string; // letter that option B maps to
  labelA: string;
  labelB: string;
}

export const MBTI_TYPES: Record<string, MbtiType> = {
  ISTJ: {
    code: "ISTJ",
    nickname: "The Logistician",
    description: "Practical, responsible, organized",
    blurb:
      "You value structure, reliability, and getting things done the right way. You're thorough, logical, and dependable — the steady anchor others lean on.",
  },
  ISFJ: {
    code: "ISFJ",
    nickname: "The Defender",
    description: "Caring, dependable, supportive",
    blurb:
      "You're warm, conscientious, and quietly devoted to the people and causes you care about. You notice what others need and make sure it gets done.",
  },
  INFJ: {
    code: "INFJ",
    nickname: "The Advocate",
    description: "Thoughtful, empathetic, idealistic",
    blurb:
      "You're an insightful idealist driven by meaning and purpose. You read between the lines, care deeply about others, and quietly work toward a better future.",
  },
  INTJ: {
    code: "INTJ",
    nickname: "The Architect",
    description: "Strategic, independent, analytical",
    blurb:
      "You're a strategic, big-picture thinker who loves turning ideas into plans. Independent and analytical, you prefer depth over small talk and always think several steps ahead.",
  },
  ISTP: {
    code: "ISTP",
    nickname: "The Virtuoso",
    description: "Practical, adaptable, problem-solver",
    blurb:
      "You're hands-on, calm under pressure, and quick to figure out how things work. You enjoy mastering tools and solving real problems with skill and precision.",
  },
  ISFP: {
    code: "ISFP",
    nickname: "The Adventurer",
    description: "Easygoing, creative, observant",
    blurb:
      "You're a gentle, artistic soul who lives in the present and notices beauty others miss. Easygoing and authentic, you express yourself through action and creativity.",
  },
  INFP: {
    code: "INFP",
    nickname: "The Mediator",
    description: "Empathetic, imaginative, values-driven",
    blurb:
      "You're an idealistic dreamer guided by strong inner values. Empathetic and imaginative, you search for meaning and want to make the world kinder and more authentic.",
  },
  INTP: {
    code: "INTP",
    nickname: "The Thinker",
    description: "Curious, analytical, inventive",
    blurb:
      "You're a curious, logical explorer who loves ideas and figuring out how things really work. Inventive and open-minded, you question assumptions and chase understanding.",
  },
  ESTP: {
    code: "ESTP",
    nickname: "The Entrepreneur",
    description: "Energetic, action-oriented, adaptable",
    blurb:
      "You're bold, energetic, and quick on your feet. You thrive in the moment, take action without hesitation, and adapt easily to whatever life throws your way.",
  },
  ESFP: {
    code: "ESFP",
    nickname: "The Entertainer",
    description: "Sociable, enthusiastic, spontaneous",
    blurb:
      "You're a lively, people-loving performer who brings energy to every room. Spontaneous and warm, you make everyday moments more fun for everyone around you.",
  },
  ENFP: {
    code: "ENFP",
    nickname: "The Campaigner",
    description: "Energetic, curious, enthusiastic",
    blurb:
      "You're an enthusiastic, imaginative free spirit who sees potential in everything and everyone. Warm and curious, you light people up with your energy and ideas.",
  },
  ENTP: {
    code: "ENTP",
    nickname: "The Debater",
    description: "Innovative, curious, enjoys new ideas",
    blurb:
      "You're a quick-witted, inventive thinker who loves exploring possibilities and challenging the status quo. Curious and clever, you spark debate and find fresh angles.",
  },
  ESTJ: {
    code: "ESTJ",
    nickname: "The Executive",
    description: "Organized, practical, decisive",
    blurb:
      "You're a natural organizer who gets things done. Decisive and practical, you bring order, accountability, and follow-through to every team and project you touch.",
  },
  ESFJ: {
    code: "ESFJ",
    nickname: "The Consul",
    description: "Sociable, supportive, cooperative",
    blurb:
      "You're a warm, conscientious team player who thrives on harmony and helping others. Supportive and sociable, you build strong communities and keep people connected.",
  },
  ENFJ: {
    code: "ENFJ",
    nickname: "The Protagonist",
    description: "Encouraging, people-focused, organized",
    blurb:
      "You're a charismatic, inspiring leader who genuinely cares about helping people grow. Encouraging and organized, you rally others toward a shared, meaningful goal.",
  },
  ENTJ: {
    code: "ENTJ",
    nickname: "The Commander",
    description: "Strategic, decisive, goal-oriented",
    blurb:
      "You're a bold, strategic leader who sets big goals and mobilizes people to reach them. Decisive and efficient, you turn vision into action and obstacles into plans.",
  },
};

export const LETTER_MEANINGS: Record<string, LetterInfo> = {
  E: { name: "Extraversion", meaning: "Energized by interaction and social environments" },
  I: { name: "Introversion", meaning: "Energized by quiet time and reflection" },
  S: { name: "Sensing", meaning: "Focuses on facts, details, and practical information" },
  N: { name: "Intuition", meaning: "Focuses on ideas, patterns, and possibilities" },
  T: { name: "Thinking", meaning: "Prioritizes logic and objective reasoning" },
  F: { name: "Feeling", meaning: "Considers values, people, and impact" },
  J: { name: "Judging", meaning: "Prefers structure, plans, and decisions" },
  P: { name: "Perceiving", meaning: "Prefers flexibility, spontaneity, and open options" },
};

export const DIMENSIONS: Record<Dimension, DimensionInfo> = {
  EI: {
    title: "E or I",
    subtitle: "How you interact",
    first: "E",
    second: "I",
    labelA: "Extraversion (E)",
    labelB: "Introversion (I)",
  },
  SN: {
    title: "S or N",
    subtitle: "How you take in information",
    first: "S",
    second: "N",
    labelA: "Sensing (S)",
    labelB: "Intuition (N)",
  },
  TF: {
    title: "T or F",
    subtitle: "How you make decisions",
    first: "T",
    second: "F",
    labelA: "Thinking (T)",
    labelB: "Feeling (F)",
  },
  JP: {
    title: "J or P",
    subtitle: "How you approach life",
    first: "J",
    second: "P",
    labelA: "Judging (J)",
    labelB: "Perceiving (P)",
  },
};

export const DIMENSION_ORDER: Dimension[] = ["EI", "SN", "TF", "JP"];

export const isValidType = (code: string): boolean =>
  Boolean(code) && code in MBTI_TYPES;
