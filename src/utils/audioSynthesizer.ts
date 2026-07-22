// Web Audio API Synthesizer for offline relaxation sounds
let audioCtx: AudioContext | null = null;
let activeSourceNodes: { stop: () => void }[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAllAmbientSounds() {
  activeSourceNodes.forEach(node => {
    try {
      node.stop();
    } catch {
      // ignore
    }
  });
  activeSourceNodes = [];
}

export function playAmbientSound(type: 'womb' | 'rain' | 'waves' | 'calm_chimes') {
  stopAllAmbientSounds();
  const ctx = getAudioContext();

  if (type === 'womb') {
    // Low frequency pink/red noise with gentle 60bpm rhythmic lowpass filtering simulating uterine pulse
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // volume
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180; // deep muffled womb frequencies

    // Pulse LFO for heartbeat rhythm
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1.0; // ~60 bpm
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 80;

    lfo.connect(filter.frequency);
    whiteNoise.connect(filter);
    filter.connect(ctx.destination);

    whiteNoise.start();
    lfo.start();

    activeSourceNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
        } catch {}
      }
    });

  } else if (type === 'rain') {
    // Gentle rain synthesis
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const rainNode = ctx.createBufferSource();
    rainNode.buffer = noiseBuffer;
    rainNode.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    rainNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    rainNode.start();
    activeSourceNodes.push({
      stop: () => {
        try { rainNode.stop(); } catch {}
      }
    });

  } else if (type === 'waves' || type === 'calm_chimes') {
    // Soft meditative sine chord oscillation
    const notes = [261.63, 329.63, 392.00, 523.25]; // C major 7 soft harmony
    const oscillators: OscillatorNode[] = [];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.04;

      // Gentle LFO swell
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + idx * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;

      lfo.connect(oscGain.gain);
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      lfo.start();
      oscillators.push(osc, lfo);
    });

    masterGain.connect(ctx.destination);

    activeSourceNodes.push({
      stop: () => {
        oscillators.forEach(o => {
          try { o.stop(); } catch {}
        });
      }
    });
  }
}
