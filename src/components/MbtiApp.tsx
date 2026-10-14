"use client";

import { useEffect, useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { resultForCode, scoreAnswers, type MbtiResult } from "@/lib/score";
import { saveResponse } from "@/lib/sheets";
import { DIMENSIONS, DIMENSION_ORDER, LETTER_MEANINGS, type Choice } from "@/lib/types";

type Phase = "form" | "result";

export default function MbtiApp() {
  const [phase, setPhase] = useState<Phase>("form");
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [name, setName] = useState("");
  const [groupColor, setGroupColor] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const total = QUESTIONS.length;
  const progress = Math.round((answeredCount / total) * 100);

  // Support deep-linking a result via #INFJ (share / refresh).
  useEffect(() => {
    const hash = window.location.hash.replace("#", "").toUpperCase();
    if (hash.length === 4) {
      const r = resultForCode(hash);
      if (r) {
        setResult(r);
        setPhase("result");
      }
    }
  }, []);

  function selectAnswer(qid: number, choice: Choice) {
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
    setMissing(false);
  }

  async function handleSubmit() {
    const unanswered = QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setMissing(true);
      const first = document.getElementById(`question-${unanswered[0].id}`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!name.trim()) {
      setContactError("Please enter your name.");
      document.getElementById("name")?.focus();
      return;
    }
    if (!groupColor) {
      setContactError("Please choose a group color.");
      document.getElementById("group-color")?.focus();
      return;
    }

    setContactError(null);

    const r = scoreAnswers(answers);
    setResult(r);
    setPhase("result");
    setSaveState("saving");
    setSaveError(null);

    // Persist to Supabase (non-blocking — result shows regardless).
    try {
      window.history.replaceState(null, "", `#${r.code}`);
      const { ok, error } = await saveResponse({
        answers: QUESTIONS.map((q) => ({
          id: q.id,
          dimension: q.dimension,
          choice: answers[q.id],
        })),
        result: r.code,
        nickname: r.nickname,
        description: r.description,
        tallies: r.tallies,
        name: name.trim(),
        groupColor,
      });
      if (ok) setSaveState("saved");
      else {
        setSaveState("error");
        setSaveError(error ?? "Unknown error");
      }
    } catch (e) {
      setSaveState("error");
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    }
  }

  function handleRetake() {
    setAnswers({});
    setResult(null);
    setName("");
    setGroupColor("");
    setSaveState("idle");
    setSaveError(null);
    setMissing(false);
    setContactError(null);
    setPhase("form");
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-3.5 w-3.5 rounded-md bg-brand-600" />
            <span className="text-xl font-bold text-slate-900">GA Quick Personality Test</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {phase === "form" ? (
          <FormView
            answers={answers}
            progress={progress}
            answeredCount={answeredCount}
            total={total}
            name={name}
            groupColor={groupColor}
            missing={missing}
            contactError={contactError}
            onName={setName}
            onGroupColor={setGroupColor}
            onSelect={selectAnswer}
            onSubmit={handleSubmit}
          />
        ) : result ? (
          <ResultView
            result={result}
            saveState={saveState}
            saveError={saveError}
            onRetake={handleRetake}
          />
        ) : null}
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-10 text-center text-sm text-slate-500">
        Based on the GA Quick Personality Test. For informational &amp; team-building
        purposes only — not a clinical assessment.
      </footer>
    </div>
  );
}

/* ----------------------------- Form view ----------------------------- */

function FormView(props: {
  answers: Record<number, Choice>;
  progress: number;
  answeredCount: number;
  total: number;
  name: string;
  groupColor: string;
  missing: boolean;
  contactError: string | null;
  onName: (v: string) => void;
  onGroupColor: (v: string) => void;
  onSelect: (qid: number, c: Choice) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Discover your personality type
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
          Choose <span className="font-bold text-slate-900">A</span> or{" "}
          <span className="font-bold text-slate-900">B</span> for each question. Pick
          whichever feels most naturally like you — don&apos;t overthink it.
        </p>
      </div>

      {/* Progress bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-8 border-b border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between text-base font-semibold text-slate-700">
          <span>
            {props.answeredCount} of {props.total} answered
          </span>
          <span>{props.progress}%</span>
        </div>
        <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${props.progress}%` }}
          />
        </div>
      </div>

      {props.missing && (
        <div className="mb-6 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-4 text-base font-medium text-amber-900">
          Please answer every question — unanswered ones are highlighted below.
        </div>
      )}

      <div className="space-y-8">
        {DIMENSION_ORDER.map((dim) => {
          const qs = QUESTIONS.filter((q) => q.dimension === dim);
          return (
            <section key={dim}>
              <h2 className="mb-3 border-b border-slate-200 pb-2 text-lg font-bold text-brand-700">
                {DIMENSIONS[dim].subtitle}
              </h2>
              <div className="space-y-4">
                {qs.map((q) => {
                  const chosen = props.answers[q.id];
                  const isUnanswered = props.missing && !chosen;
                  const num = QUESTIONS.findIndex((x) => x.id === q.id) + 1;
                  return (
                    <div
                      key={q.id}
                      id={`question-${q.id}`}
                      className={`rounded-xl border-2 bg-white p-4 sm:p-5 ${
                        isUnanswered ? "border-amber-400 ring-2 ring-amber-200" : "border-slate-200"
                      }`}
                    >
                      <p className="text-lg font-semibold text-slate-900">
                        <span className="mr-2 font-bold text-brand-700">{num}.</span>
                        {q.text}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <OptionButton
                          label="A"
                          text={q.optionA}
                          active={chosen === "A"}
                          onClick={() => props.onSelect(q.id, "A")}
                        />
                        <OptionButton
                          label="B"
                          text={q.optionB}
                          active={chosen === "B"}
                          onClick={() => props.onSelect(q.id, "B")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* About you */}
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-800">About you</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
              Your name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={props.name}
              onChange={(e) => props.onName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="group-color" className="mb-1 block text-sm font-semibold text-slate-700">
              Group color
            </label>
            <select
              id="group-color"
              value={props.groupColor}
              onChange={(e) => props.onGroupColor(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Select a color…</option>
              <option value="RED">Red</option>
              <option value="BLUE">Blue</option>
              <option value="GREEN">Green</option>
              <option value="YELLOW">Yellow</option>
            </select>
          </div>
        </div>
        {props.contactError && (
          <p role="alert" className="mt-3 text-base font-medium text-red-700">
            {props.contactError}
          </p>
        )}
      </div>

      <button
        onClick={props.onSubmit}
        className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-brand-700"
      >
        See my result →
      </button>
    </div>
  );
}

function OptionButton(props: {
  label: string;
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.active}
      className={`option-card flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-base leading-snug ${
        props.active
          ? "border-brand-600 bg-brand-50"
          : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${
          props.active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        {props.label}
      </span>
      <span className={`flex-1 ${props.active ? "font-semibold text-slate-900" : "text-slate-700"}`}>
        {props.text}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${
          props.active
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        ✓
      </span>
    </button>
  );
}

/* ----------------------------- Result view ----------------------------- */

function ResultView(props: {
  result: MbtiResult;
  saveState: "idle" | "saving" | "saved" | "error";
  saveError: string | null;
  onRetake: () => void;
}) {
  const { result } = props;

  async function copyResult() {
    const text = `My MBTI type is ${result.code} — ${result.nickname} (${result.description})`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-base font-semibold uppercase tracking-wide text-slate-600">
          Your personality type
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          {result.code.split("").map((letter, i) => (
            <span
              key={i}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-600 text-3xl font-bold text-white shadow sm:h-20 sm:w-20 sm:text-4xl"
            >
              {letter}
            </span>
          ))}
        </div>
        <h2 className="mt-5 text-3xl font-bold text-slate-900">{result.nickname}</h2>
        <p className="mt-2 text-lg font-medium text-slate-700">{result.description}</p>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-800">{result.blurb}</p>
      </div>

      {/* Dimension breakdown */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">How you scored</h3>
        <div className="mt-4 space-y-5">
          {result.dimensions.map((d) => (
            <div key={d.dimension}>
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-slate-900">
                  {d.letter} · {LETTER_MEANINGS[d.letter].name}
                </span>
                <span className="text-slate-700">
                  vs {d.other} · {LETTER_MEANINGS[d.other].name}
                </span>
              </div>
              <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-brand-600"
                  style={{ width: `${d.percent}%` }}
                />
                <div className="h-full flex-1 bg-slate-200" />
              </div>
              <p className="mt-1.5 text-sm text-slate-600">
                {LETTER_MEANINGS[d.letter].name}: {LETTER_MEANINGS[d.letter].meaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Persistence status */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="text-base">
          {props.saveState === "saving" && (
            <span className="text-slate-500">Saving your response…</span>
          )}
          {props.saveState === "saved" && (
            <span className="text-emerald-600">✓ Response saved</span>
          )}
          {props.saveState === "error" && (
            <span className="text-amber-600">
              Couldn&apos;t save: {props.saveError}
            </span>
          )}
          {props.saveState === "idle" && <span className="text-slate-400">&nbsp;</span>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={copyResult}
            className="rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Copy result
          </button>
          <button
            onClick={props.onRetake}
            className="rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700"
          >
            Retake test
          </button>
        </div>
      </div>
    </div>
  );
}
