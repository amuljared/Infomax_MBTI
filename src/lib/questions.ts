import type { Dimension } from "./types";

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  optionA: string;
  optionB: string;
}

// Source: MBTI Personality Test.docx (D:\Projects\Infomax_MBTI)
// 12 questions, 3 per dimension. Option A always maps to the first letter of the
// dimension, option B to the second (EI → E/I, SN → S/N, TF → T/F, JP → J/P).
export const QUESTIONS: Question[] = [
  // --- E or I — How you interact ---
  {
    id: 1,
    dimension: "EI",
    text: "At a company gathering, you usually...",
    optionA: "Enjoy meeting and talking to lots of people.",
    optionB: "Prefer having deeper conversations with a few people.",
  },
  {
    id: 2,
    dimension: "EI",
    text: "After a busy day surrounded by people, you...",
    optionA: "Still feel energized and want to socialize.",
    optionB: "Want some quiet time by yourself.",
  },
  {
    id: 3,
    dimension: "EI",
    text: "When joining a new group, you usually...",
    optionA: "Introduce yourself or start a conversation.",
    optionB: "Observe first and join when you feel comfortable.",
  },
  // --- S or N — How you take in information ---
  {
    id: 4,
    dimension: "SN",
    text: "When learning something new, you prefer...",
    optionA: "Clear examples and practical instructions.",
    optionB: "Understanding the overall concept and possibilities.",
  },
  {
    id: 5,
    dimension: "SN",
    text: "When someone tells you a story, you tend to remember...",
    optionA: "The specific details.",
    optionB: "The main idea or meaning behind it.",
  },
  {
    id: 6,
    dimension: "SN",
    text: "When solving a problem, you usually...",
    optionA: "Use methods that have worked before.",
    optionB: "Look for a new or creative approach.",
  },
  // --- T or F — How you make decisions ---
  {
    id: 7,
    dimension: "TF",
    text: "When making an important decision, you prioritize...",
    optionA: "Logic and objective facts.",
    optionB: "People and how they will be affected.",
  },
  {
    id: 8,
    dimension: "TF",
    text: "When giving feedback, you tend to...",
    optionA: "Be direct about what needs to improve.",
    optionB: "Think about how to say it without discouraging the person.",
  },
  {
    id: 9,
    dimension: "TF",
    text: "A coworker comes to you with a problem. Your first instinct is to...",
    optionA: "Help them find a solution.",
    optionB: "Listen and understand how they feel.",
  },
  // --- J or P — How you approach life ---
  {
    id: 10,
    dimension: "JP",
    text: "When planning an event, you prefer...",
    optionA: "A clear schedule and plan.",
    optionB: "Flexibility to change things along the way.",
  },
  {
    id: 11,
    dimension: "JP",
    text: "Your ideal weekend is...",
    optionA: "Planned with things you want to accomplish.",
    optionB: "Open with no strict schedule.",
  },
  {
    id: 12,
    dimension: "JP",
    text: "When given a deadline, you usually...",
    optionA: "Prefer to finish early or stay ahead.",
    optionB: "Work best with flexibility and may finish closer to the deadline.",
  },
];
