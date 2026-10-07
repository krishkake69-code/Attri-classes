import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check, X, RotateCcw, ArrowRight, FlaskConical } from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function InteractiveChemistryQuiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const reduceMotion = useReducedMotion();

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswerIdx(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswerIdx(null);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const resultCopy =
    score === QUIZ_QUESTIONS.length
      ? 'Three for three. This is the reasoning level the weekly tests are built around.'
      : score >= 1
        ? 'A solid start. The mechanism-first classes exist to close exactly the gaps this question set exposes.'
        : 'No reason to worry. Rote answers fail here by design. The method starts from electron movement, not memorisation.';

  return (
    <section id="quiz" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
              Try a question from last week's test
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft">
              Three questions pulled from the current NEET and JEE practice sets. The explanation
              appears after every answer, the same as it works in class.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-surface-muted p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
                <FlaskConical className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="text-xs leading-relaxed text-ink-soft">
                No signup, no email. Answers are graded exactly like the Sunday papers.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-[2rem] border border-line bg-canvas p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {!quizFinished ? (
                  <motion.div
                    key={currentQuestionIdx}
                    initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                        Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                      </p>
                      <div className="flex gap-1.5" aria-hidden="true">
                        {QUIZ_QUESTIONS.map((q, i) => (
                          <span
                            key={q.id}
                            className={`h-1 w-8 rounded-full ${
                              i <= currentQuestionIdx ? 'bg-accent' : 'bg-line'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="mt-6 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">
                      {currentQuestion.question}
                    </h3>

                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {currentQuestion.options.map((option, idx) => {
                        const isCorrect = idx === currentQuestion.correctAnswer;
                        const isSelected = idx === selectedAnswerIdx;

                        let stateClass =
                          'border-line bg-surface text-ink hover:border-line-strong';
                        if (isAnswered) {
                          if (isCorrect) {
                            stateClass = 'border-accent bg-accent-soft text-ink';
                          } else if (isSelected) {
                            stateClass = 'border-line bg-surface-muted text-ink-faint line-through';
                          } else {
                            stateClass = 'border-line bg-surface text-ink-faint';
                          }
                        }

                        return (
                          <button
                            key={option}
                            disabled={isAnswered}
                            onClick={() => handleOptionClick(idx)}
                            className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition-colors duration-200 disabled:cursor-default ${stateClass}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-[11px] text-ink-faint">
                                {OPTION_LETTERS[idx]}
                              </span>
                              {option}
                            </span>
                            {isAnswered && isCorrect && (
                              <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                              <X className="h-4 w-4 shrink-0" strokeWidth={2} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div aria-live="polite">
                      {isAnswered && (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-6 rounded-2xl border border-line bg-surface-muted p-5"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                            {selectedAnswerIdx === currentQuestion.correctAnswer
                              ? 'Correct'
                              : 'Not quite'}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                            {currentQuestion.explanation}
                          </p>
                          <button
                            onClick={handleNext}
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-strong"
                          >
                            {currentQuestionIdx === QUIZ_QUESTIONS.length - 1
                              ? 'See score'
                              : 'Next question'}
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="py-4 text-center"
                  >
                    <p className="font-mono text-5xl font-medium text-ink">
                      {score}/{QUIZ_QUESTIONS.length}
                    </p>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                      Score on the practice set
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                      {resultCopy}
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <button
                        onClick={handleRestart}
                        className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
                      >
                        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                        Try again
                      </button>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
                      >
                        Book a free demo
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
