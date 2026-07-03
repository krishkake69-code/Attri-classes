import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, Award, RotateCcw, ArrowRight, Brain } from 'lucide-react';

export default function InteractiveChemistryQuiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="quiz-fun">
      {/* Background shapes */}
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-600/10 blur-[100px] pointer-events-none translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-900/50 border border-blue-500/20 rounded-full text-xs text-blue-400 font-bold uppercase mb-3">
            <Brain className="w-4 h-4 animate-bounce" /> Chemistry Quiz Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Test Your Chemistry IQ!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Answer these 3 conceptual NEET/JEE syllabus questions correctly and unlock a special academic scholarship from Attri Chemistry Classes!
          </p>
        </div>

        {/* Quiz Body Card */}
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Question Progress bar */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>QUESTION 0{currentQuestionIdx + 1} OF 0{QUIZ_QUESTIONS.length}</span>
                  <span>SCORE: {score}/{QUIZ_QUESTIONS.length}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question sentence */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                  {currentQuestion.question}
                </h3>

                {/* Option grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    let optionStyle = 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 text-slate-300';
                    
                    if (isAnswered) {
                      if (idx === currentQuestion.correctAnswer) {
                        optionStyle = 'border-emerald-500/50 bg-emerald-950/25 text-emerald-300';
                      } else if (idx === selectedAnswerIdx) {
                        optionStyle = 'border-rose-500/50 bg-rose-950/25 text-rose-300';
                      } else {
                        optionStyle = 'border-slate-900/50 bg-slate-950/40 text-slate-600';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionClick(idx)}
                        className={`p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && idx === currentQuestion.correctAnswer && (
                          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && idx === selectedAnswerIdx && idx !== currentQuestion.correctAnswer && (
                          <X className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/40 text-xs sm:text-sm text-blue-200 mt-4 space-y-1.5"
                  >
                    <span className="font-extrabold flex items-center gap-1.5 text-orange-400">
                      <Sparkles className="w-4 h-4" /> Concept Clarity Explanation:
                    </span>
                    <p className="leading-relaxed font-medium">{currentQuestion.explanation}</p>
                    <button
                      onClick={handleNext}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto text-orange-400 border border-orange-500/20">
                  <Award className="w-10 h-10 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Your Chemistry IQ Score: {score}/{QUIZ_QUESTIONS.length}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                    {score === QUIZ_QUESTIONS.length
                      ? 'Incredible! You have robust analytical concepts. You qualify for a 20% Special Merit Scholarship!'
                      : score >= 1
                      ? 'Good attempt! There is scope for building solid fundamentals in organic & chemical equations.'
                      : 'Never worry! Chemistry requires visual concept mapping instead of memorization. We can guide you from scratch.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleRestart}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-900 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>

                  <a
                    href="#contact"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-1"
                  >
                    Claim Your Scholarship Demo <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
