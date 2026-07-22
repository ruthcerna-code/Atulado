import React, { useState } from 'react';
import { ClipboardList, AlertCircle, CheckCircle2, RotateCcw, ShieldAlert, Heart, Phone } from 'lucide-react';
import { EPDS_QUESTIONS, interpretEpdsScore } from '../data/epdsData';
import { EpdsResult } from '../types';

interface EpdsViewProps {
  onSaveResult: (result: EpdsResult) => void;
  onOpenSos: () => void;
}

export const EpdsView: React.FC<EpdsViewProps> = ({ onSaveResult, onOpenSos }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<EpdsResult | null>(null);

  const currentQuestion = EPDS_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (score: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < EPDS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final results
      let total = 0;
      Object.values(updatedAnswers).forEach((s) => (total += Number(s)));
      const item10 = Number(updatedAnswers[10]) || 0;

      const { riskLevel } = interpretEpdsScore(total, item10);
      const dateStr = new Date().toISOString().split('T')[0];

      const epdsRes: EpdsResult = {
        id: `epds_${Date.now()}`,
        timestamp: Date.now(),
        dateStr,
        totalScore: total,
        item10Score: item10,
        riskLevel
      };

      setResult(epdsRes);
      setIsCompleted(true);
      onSaveResult(epdsRes);
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
      <div>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-[#5A5A40]" />
          <h1 className="serif text-2xl font-bold text-[#5A5A40]">Evaluación EPDS</h1>
        </div>
        <p className="sans text-xs text-[#5A5A40]/80 mt-1">
          Escala de Depresión Postnatal de Edimburgo (EPDS). Responde pensando en cómo te has sentido en los últimos 7 días.
        </p>
      </div>

      {!isCompleted ? (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#5A5A40] mb-2">
              <span>Pregunta {currentQuestionIndex + 1} de {EPDS_QUESTIONS.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / EPDS_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5A40] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / EPDS_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="py-2">
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
                <div className="w-5 h-5 rounded-full border border-[#5A5A40]/30 group-hover:border-[#5A5A40] group-hover:bg-[#5A5A40] shrink-0 transition-colors" />
              </button>
            ))}
          </div>

          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="text-xs text-[#5A5A40] hover:underline pt-2 font-medium"
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
              const interpretation = interpretEpdsScore(result.totalScore, result.item10Score);
              return (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-[#5A5A40]/10 flex items-center justify-center mx-auto text-[#5A5A40]">
                      <Heart className="w-8 h-8 fill-[#5A5A40]" />
                    </div>
                    <span className="sans text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]/70">
                      Resultado de tu Cuestionario
                    </span>
                    <h2 className="serif text-2xl font-bold text-[#2D2D2D]">
                      Puntaje Total: {result.totalScore} / 30
                    </h2>
                    <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-bold ${interpretation.badgeColor}`}>
                      {interpretation.title}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 leading-relaxed text-xs text-[#2D2D2D]">
                    <p className="font-semibold text-[#5A5A40] mb-1">Interpretación Clínica:</p>
                    <p>{interpretation.recommendation}</p>
                  </div>

                  {/* Safety Check for Item 10 */}
                  {result.item10Score > 0 && (
                    <div className="p-4 rounded-2xl bg-[#D67C65]/15 border border-[#D67C65]/30 space-y-2">
                      <div className="flex items-center gap-2 text-[#D67C65] font-bold text-xs">
                        <ShieldAlert className="w-5 h-5" />
                        <span>Alerta de Autocuidado Requerido</span>
                      </div>
                      <p className="sans text-xs text-[#D67C65]/90 leading-relaxed">
                        Detectamos inquietud en la pregunta 10. Por tu seguridad y paz mental, te sugerimos comunicarte ahora mismo con la Línea *4141 o tu red de apoyo.
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

                  <div className="pt-4 border-t border-[#5A5A40]/10 flex flex-col sm:flex-row gap-3 justify-between">
                    <button
                      onClick={restartTest}
                      className="px-4 py-3 rounded-2xl bg-[#F5F5F0] hover:bg-[#E8DCC4] text-[#5A5A40] font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Volver a realizar el cuestionario</span>
                    </button>
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
