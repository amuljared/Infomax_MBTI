import { QUESTIONS } from "./questions";
import {
  DIMENSIONS,
  DIMENSION_ORDER,
  MBTI_TYPES,
  type Choice,
  type Dimension,
} from "./types";

export interface DimensionResult {
  dimension: Dimension;
  letter: string;
  other: string;
  count: number;
  otherCount: number;
  percent: number; // percentage of answers that went to the chosen letter
}

export interface MbtiResult {
  code: string;
  tallies: Record<string, number>;
  dimensions: DimensionResult[];
  nickname: string;
  description: string;
  blurb: string;
}

/**
 * Build a display-ready result for a known type code (e.g. when a result is
 * deep-linked via the URL hash and we don't have the original answers).
 * Dimension bars render as an even 50/50 split.
 */
export function resultForCode(code: string): MbtiResult | null {
  if (!(code in MBTI_TYPES)) return null;
  const type = MBTI_TYPES[code];
  const dims: DimensionResult[] = DIMENSION_ORDER.map((dim, i) => {
    const letter = code[i];
    const other = DIMENSIONS[dim].first === letter ? DIMENSIONS[dim].second : DIMENSIONS[dim].first;
    return { dimension: dim, letter, other, count: 0, otherCount: 0, percent: 50 };
  });
  return {
    code,
    tallies: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
    dimensions: dims,
    nickname: type.nickname,
    description: type.description,
    blurb: type.blurb,
  };
}

export function scoreAnswers(answers: Record<number, Choice>): MbtiResult {
  // Tally letters across all four dimensions.
  const tallies: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  for (const q of QUESTIONS) {
    const choice = answers[q.id];
    if (!choice) continue; // unanswered question — ignore
    const letter = choice === "A" ? DIMENSIONS[q.dimension].first : DIMENSIONS[q.dimension].second;
    tallies[letter] += 1;
  }

  // Decide each dimension (ties go to the first letter).
  const dimensions: DimensionResult[] = DIMENSION_ORDER.map((dim) => {
    const info = DIMENSIONS[dim];
    const firstCount = tallies[info.first];
    const secondCount = tallies[info.second];
    const chooseFirst = firstCount >= secondCount;
    const letter = chooseFirst ? info.first : info.second;
    const other = chooseFirst ? info.second : info.first;
    const count = chooseFirst ? firstCount : secondCount;
    const otherCount = chooseFirst ? secondCount : firstCount;
    const total = firstCount + secondCount;
    const percent = total === 0 ? 50 : Math.round((count / total) * 100);
    return { dimension: dim, letter, other, count, otherCount, percent };
  });

  const code = dimensions.map((d) => d.letter).join("");
  const type = MBTI_TYPES[code] ?? MBTI_TYPES.ISTJ;

  return {
    code,
    tallies,
    dimensions,
    nickname: type.nickname,
    description: type.description,
    blurb: type.blurb,
  };
}
