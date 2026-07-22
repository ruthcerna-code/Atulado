import React, { useState, useEffect } from 'react';
import { Wind, Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, Eye, Hand, Disc, Ear, Smile } from 'lucide-react';
import { playAmbientSound, stopAllAmbientSounds } from '../utils/audioSynthesizer';

export const BreathingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'sounds'>('breathing');

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Sostén' | 'Exhala' | 'Pausa'>('Inhala');
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 mins
  const [soundType, setSoundType] = useState<'none' | 'womb' | 'rain' | 'waves' | 'calm_chimes'>('none');

  // Grounding technique step state (5-4-3-2-1)
  const [groundingStep, setGroundingStep] = useState(0);

  // Breathing cycle animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            stopAllAmbientSounds();
            setSoundType('none');
            return 0;
          }
          return prev - 1;
        });

        // 4-4-4-4 box breathing cycle logic (16 seconds total per cycle)
        const currentSec = timerSeconds % 16;
        if (currentSec >= 12) setBreathPhase('Inhala');
        else if (currentSec >= 8) setBreathPhase('Sostén');
        else if (currentSec >= 4) setBreathPhase('Exhala');
        else setBreathPhase('Pausa');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const toggleSound = (type: 'womb' | 'rain' | 'waves' | 'calm_chimes') => {
    if (soundType === type) {
      stopAllAmbientSounds();
      setSoundType('none');
    } else {
      setSoundType(type);
      playAmbientSound(type);
    }
  };

  const groundingSteps = [
    {
      num: 5,
      title: '5 Cosas que puedes VER',
      icon: Eye,
      desc: 'Mira a tu alrededor. Nombra 5 objetos que estén cerca de ti: una planta, la luz de la ventana, una textura.'
    },
    {
      num: 4,
      title: '4 Cosas que puedes TOCAR',
      icon: Hand,
      desc: 'Siente la textura de tu ropa, la firmeza de la silla, la temperatura de tus manos o tus pies apoyados en el suelo.'
    },
    {
      num: 3,
      title: '3 Sonidos que puedes ESCUCHAR',
      icon: Ear,
      desc: 'Presta atención a los ruidos lejanos: el viento, el zumbido de un aparato, el sonido de tu propia respiración.'
    },
    {
      num: 2,
      title: '2 Olores que puedes PERCIBIR',
      icon: Disc,
      desc: 'Huele el aire, tu perfume, el té o una prenda cercana. Si no percibes olores, recuerda 2 aromas que te reconforten.'
    },
    {
      num: 1,
      title: '1 Sensación Positiva sobre TI',
      icon: Smile,
      desc: 'Di internamente: "Estoy a salvo aquí y ahora. Estoy haciendo lo mejor que puedo y es suficiente."'
    }
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-[#5A5A40]" />
          <h1 className="serif text-2xl font-bold text-[#5A5A40]">Pausa Consciente</h1>
        </div>
        <p className="sans text-xs text-[#5A5A40]/80 mt-1">
          Espacio de autorregulación guiada, respiración y sonidos relajantes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-2xl bg-[#E8DCC4]/40 border border-[#5A5A40]/10 text-xs font-bold text-[#5A5A40]">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'breathing' ? 'bg-white text-[#5A5A40] shadow-2xs' : 'opacity-70 hover:opacity-100'
          }`}
        >
          Respiración Guiada
        </button>
        <button
          onClick={() => setActiveTab('grounding')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'grounding' ? 'bg-white text-[#5A5A40] shadow-2xs' : 'opacity-70 hover:opacity-100'
          }`}
        >
          Grounding 5-4-3-2-1
        </button>
        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'sounds' ? 'bg-white text-[#5A5A40] shadow-2xs' : 'opacity-70 hover:opacity-100'
          }`}
        >
          Sonidos Ambiente
        </button>
      </div>

      {/* 1. Breathing Visualizer Tab */}
      {activeTab === 'breathing' && (
        <div className="p-8 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow flex flex-col items-center text-center space-y-6">
          <span className="sans text-xs font-bold uppercase tracking-widest text-[#5A5A40]/70">
            Respiración Cuadrada 4-4-4-4
          </span>

          {/* Animated Breath Bubble */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4">
            <div
              className={`absolute inset-0 rounded-full bg-[#5A5A40]/15 transition-transform duration-4000 ease-in-out ${
                breathPhase === 'Inhala'
                  ? 'scale-100 bg-[#5A5A40]/25'
                  : breathPhase === 'Sostén'
                  ? 'scale-100 bg-[#5A5A40]/30'
                  : 'scale-60 bg-[#5A5A40]/10'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center justify-center text-[#5A5A40]">
              <span className="serif text-2xl font-bold tracking-tight mb-1">{breathPhase}</span>
              <span className="sans text-xs opacity-80">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-3 rounded-full bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pausar' : 'Iniciar Respiración'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setTimerSeconds(180);
                setBreathPhase('Inhala');
              }}
              className="p-3 rounded-full bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4] transition-all"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="sans text-xs text-[#5A5A40]/80 max-w-xs leading-relaxed pt-2">
            Sigue el ritmo de la esfera. Inhala profundamente durante 4 segundos, mantén el aire 4 segundos y exhala suavemente.
          </p>
        </div>
      )}

      {/* 2. Grounding 5-4-3-2-1 Tab */}
      {activeTab === 'grounding' && (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="serif text-lg font-bold text-[#5A5A40]">
              Técnica de Anclaje al Presente
            </h2>
            <span className="sans text-xs font-bold text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-1 rounded-full">
              Paso {groundingStep + 1} de 5
            </span>
          </div>

          {(() => {
            const step = groundingSteps[groundingStep];
            const StepIcon = step.icon;
            return (
              <div className="p-6 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
                  <StepIcon className="w-7 h-7" />
                </div>

                <h3 className="serif text-xl font-bold text-[#2D2D2D]">{step.title}</h3>
                <p className="sans text-xs text-[#5A5A40] leading-relaxed max-w-sm mx-auto">
                  {step.desc}
                </p>

                <div className="pt-4 flex justify-between gap-3">
                  <button
                    disabled={groundingStep === 0}
                    onClick={() => setGroundingStep(groundingStep - 1)}
                    className="px-4 py-2 rounded-xl border border-[#5A5A40]/20 text-xs font-bold text-[#5A5A40] disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={() => setGroundingStep((groundingStep + 1) % 5)}
                    className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833]"
                  >
                    {groundingStep === 4 ? 'Completar Anclaje' : 'Siguiente Paso'}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Ambient Sounds Tab */}
      {activeTab === 'sounds' && (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
          <h2 className="serif text-lg font-bold text-[#5A5A40]">Paisajes Sonoros Relajantes</h2>
          <p className="sans text-xs text-[#5A5A40]/80 mb-4">
            Sonidos sintéticos generados en tu navegador para inducir calma inmediata.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'womb', title: 'Ruido Blanco Uterino', desc: 'Frecuencias bajas envolventes' },
              { id: 'rain', title: 'Lluvia Suave', desc: 'Gotas rítmicas de descanso' },
              { id: 'waves', title: 'Acordes de Calma', desc: 'Armonía suave sinusoidal' }
            ].map((sound) => {
              const isPlaying = soundType === sound.id;
              return (
                <div
                  key={sound.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isPlaying
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                      : 'bg-white text-[#2D2D2D] border-[#5A5A40]/15'
                  }`}
                >
                  <div>
                    <div className="serif text-sm font-bold">{sound.title}</div>
                    <div className={`sans text-[11px] ${isPlaying ? 'text-white/80' : 'text-[#5A5A40]/70'}`}>
                      {sound.desc}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSound(sound.id as typeof soundType)}
                    className={`p-3 rounded-full transition-all ${
                      isPlaying ? 'bg-white text-[#5A5A40]' : 'bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4]'
                    }`}
                  >
                    {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
