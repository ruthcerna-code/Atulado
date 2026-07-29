import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, RotateCcw, Heart, ShieldAlert, Phone, ArrowLeft, FileText } from 'lucide-react';
import { GAD7_QUESTIONS, interpretGad7Score } from '../data/gad7Data';
import { Gad7Result } from '../types';

interface Gad7ViewProps {
  onSaveResult: (result: Gad7Result) => void;
  onOpenSos: () => void;
  onBackToDashboard?: () => void;
}

export const Gad7View: React.FC<Gad7ViewProps> = ({ onSaveResult, onOpenSos, onBackToDashboard }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<Gad7Result | null>(null);

  const currentQuestion = GAD7_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (score: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < GAD7_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final results
      let total = 0;
      Object.values(updatedAnswers).forEach((s) => (total += Number(s)));

      const { riskLevel } = interpretGad7Score(total);
      const dateStr = new Date().toISOString().split('T')[0];

      const gad7Res: Gad7Result = {
        id: `gad7_${Date.now()}`,
        timestamp: Date.now(),
        dateStr,
        totalScore: total,
        riskLevel
      };

      setResult(gad7Res);
      setIsCompleted(true);
      onSaveResult(gad7Res);
    }
  };

  const restartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setResult(null);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#5A5A40]" />
            <h1 className="serif text-2xl font-bold text-[#5A5A40]">Test de Ansiedad GAD-7</h1>
          </div>
          <p className="sans text-xs text-[#5A5A40]/80 mt-1">
            Escala de Ansiedad Generalizada (GAD-7). Responde considerando con qué frecuencia te han molestado estos problemas en las <strong>últimas 2 semanas</strong>.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="text-xs text-[#5A5A40] hover:underline font-bold flex items-center gap-1 self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        )}
      </div>

      {!isCompleted ? (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#5A5A40] mb-2">
              <span>Pregunta {currentQuestionIndex + 1} de {GAD7_QUESTIONS.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / GAD7_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5A40] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / GAD7_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="py-2">
            <span className="sans text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]/70 block mb-1">
              ¿Qué tan seguido en los últimos 14 días?
            </span>
            <h2 className="serif text-base sm:text-lg font-bold text-[#2D2D2D] leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.score)}
                className="w-full p-4 rounded-2xl bg-white border border-[#5A5A40]/15 hover:border-[#5A5A40] hover:bg-[#F5F5F0] text-left transition-all text-xs text-[#2D2D2D] font-medium shadow-2xs active:scale-98 flex items-center justify-between group"
              >
                <span>{option.text}</span>
                <span className="text-[11px] font-bold text-[#5A5A40]/60 bg-[#F5F5F0] px-2 py-0.5 rounded-md group-hover:bg-[#E8DCC4] transition-colors">
                  +{option.score} {option.score === 1 ? 'pto' : 'ptos'}
                </span>
              </button>
            ))}
          </div>

          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="text-xs text-[#5A5A40] hover:underline pt-2 font-medium block"
            >
              ← Volver a la pregunta anterior
            </button>
          )}
        </div>
      ) : (
        /* Results View */
        result && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6 animate-in zoom-in-95 duration-300">
            {(() => {
              const interpretation = interpretGad7Score(result.totalScore);
              return (
                <>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#5A5A40]/10 flex items-center justify-center mx-auto text-[#5A5A40]">
                      <Activity className="w-8 h-8 text-[#5A5A40]" />
                    </div>
                    <span className="sans text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]/70 block">
                      Resultado Inmediato de tu Cuestionario GAD-7
                    </span>
                    <h2 className="serif text-3xl font-bold text-[#2D2D2D]">
                      Puntaje Total: {result.totalScore} / 21
                    </h2>
                    <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-bold ${interpretation.badgeColor}`}>
                      {interpretation.title} ({interpretation.badgeText})
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#5A5A40]/15 leading-relaxed text-xs text-[#2D2D2D] space-y-2">
                    <p className="font-bold text-[#5A5A40] text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Interpretación & Orientación Clínica:</span>
                    </p>
                    <p className="text-[#2D2D2D]/90 leading-relaxed">
                      {interpretation.recommendation}
                    </p>
                    <div className="pt-2 border-t border-[#5A5A40]/10 text-[11px] text-[#5A5A40]/80">
                      Este resultado ha sido <strong>guardado automáticamente en tu Ficha Clínica</strong> y estará disponible para tu revisión y la de tu psicólogo/a tratante.
                    </div>
                  </div>

                  {/* Range Reference scale */}
                  <div className="p-4 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10 text-xs space-y-2">
                    <span className="font-bold text-[#5A5A40] text-[11px] uppercase tracking-wider block">
                      Escala de Referencia GAD-7:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-center">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="font-bold block text-emerald-800">0 - 4 pts</span>
                        <span className="text-emerald-700">Ansiedad Mínima</span>
                      </div>
                      <div className="p-2 rounded-xl bg-teal-50 border border-teal-200">
                        <span className="font-bold block text-teal-800">5 - 9 pts</span>
                        <span className="text-teal-700">Ansiedad Leve</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="font-bold block text-amber-800">10 - 14 pts</span>
                        <span className="text-amber-700">Ansiedad Moderada</span>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                        <span className="font-bold block text-rose-800">15 - 21 pts</span>
                        <span className="text-rose-700">Ansiedad Severa</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Alert for Moderate/Severe */}
                  {(result.riskLevel === 'moderate' || result.riskLevel === 'severe') && (
                    <div className="p-4 rounded-2xl bg-[#D67C65]/15 border border-[#D67C65]/30 space-y-2">
                      <div className="flex items-center gap-2 text-[#D67C65] font-bold text-xs">
                        <ShieldAlert className="w-5 h-5" />
                        <span>Sugerencia de Acompañamiento</span>
                      </div>
                      <p className="sans text-xs text-[#D67C65]/90 leading-relaxed">
                        Si te sientes sobrepasada en este momento, recuerda que cuentas con la Línea de Apoyo *4141 y la red de contención de tu comunidad.
                      </p>
                      <button
                        onClick={onOpenSos}
                        className="px-4 py-2 bg-[#D67C65] text-white rounded-xl text-xs font-bold hover:bg-[#C06852] flex items-center gap-1.5 shadow-2xs"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Contactar Apoyo SOS Inmediato (*4141)</span>
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={restartTest}
                      className="flex-1 py-3 px-4 rounded-2xl bg-white border border-[#5A5A40]/20 hover:bg-[#F5F5F0] text-[#5A5A40] text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Repetir Test GAD-7</span>
                    </button>

                    {onBackToDashboard && (
                      <button
                        onClick={onBackToDashboard}
                        className="flex-1 py-3 px-4 rounded-2xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Volver al Dashboard / Ficha</span>
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )
      )}
    </div>
  );
};
